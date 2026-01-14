import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { useThemeStore } from '@/stores/theme.store';
import { PropsWithChildren, useEffect, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

export function ThemeProvider({ children }: PropsWithChildren) {
  const mode = useThemeStore(s => s.theme);
  const [currentSystemTheme, setCurrentSystemTheme] = useState<ColorSchemeName>(() =>
    Appearance.getColorScheme(),
  );

  // Listen for system theme changes
  useEffect(() => {
    // Always get the fresh system theme when mode changes or component mounts
    const freshTheme = Appearance.getColorScheme();
    setCurrentSystemTheme(freshTheme);

    // Subscribe to system theme changes
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setCurrentSystemTheme(colorScheme);
    });

    return () => {
      subscription.remove();
    };
  }, [mode]); // Re-run when mode changes

  // Determine the actual theme to use
  const activeTheme = mode === 'system' ? (currentSystemTheme ?? 'light') : mode;

  return <GluestackUIProvider mode={activeTheme}>{children}</GluestackUIProvider>;
}
