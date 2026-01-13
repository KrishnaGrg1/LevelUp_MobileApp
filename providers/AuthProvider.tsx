import { useGetMe } from "@/hooks/useUser";
import authStore from "@/stores/auth.store";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider - Manages user authentication and data fetching
 * Fetches user data on mount and updates the auth store
 * Ensures user data is available before rendering children
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { refetch: refetchMe } = useGetMe();
  const setUser = authStore((state) => state.setUser);
  const hasHydrated = authStore((state) => state._hasHydrated);

  useEffect(() => {
    // Wait for auth state to hydrate from AsyncStorage
    if (!hasHydrated) {
      return;
    }

    const fetchUserData = async () => {
      try {
        const result = await refetchMe();
        if (result.data?.body.data) {
          setUser(result.data.body.data);
          console.log("✅ User data loaded:", result.data.body.data.id);
        }
      } catch (error) {
        console.error("❌ Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [hasHydrated, refetchMe, setUser]);

  // Show loading indicator while fetching user data
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
