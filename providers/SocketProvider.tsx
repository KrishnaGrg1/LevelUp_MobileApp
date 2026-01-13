import { connectSocket, disconnectSocket } from "@/lib/socket";
import useAuthStore from "@/stores/auth.store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";

interface SocketProviderProps {
  children: React.ReactNode;
}

/**
 * Global socket connection manager
 * Connects socket when user is authenticated
 */
export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const initSocket = async () => {
      if (isAuthenticated && user) {
        // Get auth token from AsyncStorage
        const token = await AsyncStorage.getItem("authToken");

        // Connect socket with authentication
        connectSocket(token || undefined, user.id);
        console.log("✅ Socket connected for user:", user.id);
      } else {
        // Disconnect when user logs out
        disconnectSocket();
      }
    };

    initSocket();

    return () => {
      if (!isAuthenticated) {
        disconnectSocket();
      }
    };
  }, [isAuthenticated, user]);

  return <>{children}</>;
};
