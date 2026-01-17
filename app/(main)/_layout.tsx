import { AuthProvider } from '@/providers/AuthProvider';
import { SocketProvider } from '@/providers/SocketProvider';
import authStore from '@/stores/auth.store';
import { useLanguage } from '@/translation';
import { Redirect, Slot } from 'expo-router';
import React, { useMemo } from 'react';

export default function MainLayout() {
  // ✅ Select ONLY primitive auth state values
  const isAuthenticated = authStore(state => state.isAuthenticated);
  const hasHydrated = authStore(state => state._hasHydrated);
  // Subscribe to language changes to force remount
  const language = useLanguage();

  // Memoize the slot to prevent it from being recreated on every render
  // Only recreate when language changes (which requires a remount of screens)
  const slot = useMemo(() => <Slot key={language} />, [language]);

  // Wait for hydration before rendering anything
  if (!hasHydrated) {
    return null;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  // Inline providers to ensure they don't unmount unnecessarily
  // The useMemo for "slot" ensures that the Slot itself is stable
  return (
    <AuthProvider>
      <SocketProvider>{slot}</SocketProvider>
    </AuthProvider>
  );
}
