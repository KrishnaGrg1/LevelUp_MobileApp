import '@/global.css';
import QueryProviders from '@/providers/QueryProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { OverlayProvider } from '@gluestack-ui/core/overlay/creator';
import { Stack } from 'expo-router';

/**
 * RootLayout - Top-level app layout
 * NOTE: OverlayProvider is already included in GluestackUIProvider (via ThemeProvider)
 * so we don't need to wrap with it here
 */
export default function RootLayout() {
  return (
    <ThemeProvider>
      <QueryProviders>
        <OverlayProvider>
          <Stack />
        </OverlayProvider>
      </QueryProviders>
    </ThemeProvider>
  );
}
