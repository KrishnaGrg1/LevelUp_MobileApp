import { connectSocket, disconnectSocket } from '@/lib/socket';
import useAuthStore from '@/stores/auth.store';
import React, { useEffect } from 'react';

interface SocketProviderProps {
  children: React.ReactNode;
}

/**
 * SocketProvider - Manages WebSocket connections
 * Should be wrapped by AuthProvider to ensure user data is available
 * Automatically connects/disconnects socket based on auth state
 */
export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const user = useAuthStore(state => state.user);
  const authSession = useAuthStore(state => state.authSession);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated && user?.id && authSession) {
      // Connect socket with authentication token
      connectSocket(authSession, user.id);
      console.log('✅ Socket connected for user:', user.id);

      // Cleanup: disconnect on unmount or when dependencies change
      return () => {
        disconnectSocket();
        console.log('🔌 Socket disconnected');
      };
    } else {
      // Ensure socket is disconnected if not authenticated
      disconnectSocket();
    }
  }, [isAuthenticated, user?.id, authSession]);

  return <>{children}</>;
};
