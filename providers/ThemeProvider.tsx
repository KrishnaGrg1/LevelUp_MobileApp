import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { useThemeStore } from '@/stores/theme.store';
import { useColorScheme } from 'nativewind';
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
  
  // NATIVEWIND SYNC: NativeWind requires `useColorScheme` from 'nativewind' or direct class manipulation if using class strategy without vars.
  // Since tailwind.config.js has darkMode: 'class', we just need to ensure Gluestack prop 'mode' is correctly passed (which it is),
  // BUT NativeWind components might not be listening to Gluestack provider.
  // Actually, NativeWind usually uses `useColorScheme` from "nativewind".
  // Let's import { useColorScheme } from "nativewind"; and set it.

  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(activeTheme);
  }, [activeTheme, setColorScheme]);

  return <GluestackUIProvider mode={activeTheme}>{children}</GluestackUIProvider>;
}
