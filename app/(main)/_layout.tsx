import { AuthProvider } from '@/providers/AuthProvider';
import { SocketProvider } from '@/providers/SocketProvider';
import authStore from '@/stores/auth.store';
import { Redirect, Slot } from 'expo-router';

/**
 * MainLayout - Protected routes layout
 * Ensures user is authenticated before rendering
 * Wraps with AuthProvider → SocketProvider for proper initialization
 */
export default function MainLayout() {
  const isAuthenticated = authStore(state => state.isAuthenticated);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <AuthProvider>
      <SocketProvider>
        <Slot />
      </SocketProvider>
    </AuthProvider>
  );
}
