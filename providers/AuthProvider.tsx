import { useGetMe } from '@/hooks/useUser';
import authStore from '@/stores/auth.store';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider - Manages user authentication and data fetching
 * Fetches user data on mount and updates the auth store
 * Ensures user data is available before rendering children
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // ✅ ALL HOOKS FIRST
  const [isLoading, setIsLoading] = useState(true);
  const { refetch: refetchMe } = useGetMe();

  // Use useShallow to prevent unnecessary re-renders
  const { setUser, hasHydrated } = authStore(
    useShallow(state => ({
      setUser: state.setUser,
      hasHydrated: state._hasHydrated,
    })),
  );

  useEffect(() => {
    console.log('🔍 AuthProvider: hasHydrated =', hasHydrated);

    // Wait for auth state to hydrate from AsyncStorage
    if (!hasHydrated) {
      return;
    }

    const fetchUserData = async () => {
      try {
        console.log('📡 AuthProvider: Fetching user data...');
        const result = await refetchMe();
        if (result.data?.body.data) {
          console.log('✅ AuthProvider: User data loaded:', result.data.body.data.id);
          setUser(result.data.body.data);
        } else {
          console.log('⚠️ AuthProvider: No user data in response');
        }
      } catch (error) {
        console.error('❌ AuthProvider: Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [hasHydrated, refetchMe, setUser]);

  // Show loading indicator while fetching user data
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
