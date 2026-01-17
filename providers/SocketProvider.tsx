import { connectSocket, disconnectSocket } from '@/api/endPoints/socket';
import useAuthStore from '@/stores/auth.store';
import React, { useEffect, useRef } from 'react';

interface SocketProviderProps {
  children: React.ReactNode;
}

// Module-level flag to track intentional logout
let isIntentionalLogout = false;

/**
 * Set the intentional logout flag
 * Call this before logout to allow proper socket cleanup
 */
export const setIntentionalLogout = (value: boolean) => {
  isIntentionalLogout = value;
};

/**
 * SocketProvider - Manages WebSocket connections
 * Should be wrapped by AuthProvider to ensure user data is available
 * Automatically connects/disconnects socket based on auth state
 *
 * IMPORTANT: Only disconnects socket on intentional logout, not on
 * unexpected unmounts (e.g., language change causing remount)
 */
export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const isConnectedRef = useRef(false);
  const connectedUserIdRef = useRef<string | undefined>(undefined);

  // ✅ Select ONLY primitive values to prevent unnecessary re-renders
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const userId = useAuthStore(state => state.user?.id);
  const authSession = useAuthStore(state => state.authSession);

  useEffect(() => {
    // Should connect?
    const shouldConnect = isAuthenticated && userId && authSession;

    if (shouldConnect && !isConnectedRef.current) {
      // Connect socket
      console.log('📡 Connecting socket for user:', userId);
      connectSocket(authSession, userId);
      isConnectedRef.current = true;
      connectedUserIdRef.current = userId;
    } else if (!shouldConnect && isConnectedRef.current) {
      // Logged out - disconnect socket
      console.log('🔌 Auth state cleared, disconnecting socket');
      disconnectSocket();
      isConnectedRef.current = false;
      connectedUserIdRef.current = undefined;
    } else if (shouldConnect && isConnectedRef.current) {
      // Already connected, check if session changed
      if (userId !== connectedUserIdRef.current) {
        console.log('🔄 User changed, reconnecting socket...');
        disconnectSocket();
        connectSocket(authSession, userId);
        connectedUserIdRef.current = userId;
      }
    }

    // Cleanup on unmount - only disconnect if intentional logout
    return () => {
      if (isConnectedRef.current) {
        if (isIntentionalLogout) {
          console.log('🔌 Intentional logout - disconnecting socket');
          disconnectSocket();
          isConnectedRef.current = false;
          connectedUserIdRef.current = undefined;
        } else {
          console.log('⚠️ SocketProvider unmounting but keeping socket alive (not a logout)');
          // Don't disconnect - this is likely a language change or navigation
        }
      }
    };
  }, [isAuthenticated, userId, authSession]);

  // Always render children - no conditional logic
  return <>{children}</>;
};

export default SocketProvider;
