import '@/global.css';
import QueryProviders from '@/providers/QueryProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import authStore from '@/stores/auth.store';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Wait for the store to hydrate
    const unsubscribe = authStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });

    // Check if already hydrated
    if (authStore.persist.hasHydrated()) {
      setIsHydrated(true);
    }

    return unsubscribe;
  }, []);

  // Show loading screen while hydrating
  if (!isHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <QueryProviders>
        <Stack />
      </QueryProviders>
    </ThemeProvider>
  );
}
