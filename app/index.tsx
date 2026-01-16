import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ModeToggle } from '@/components/ModeToggle';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import authStore from '@/stores/auth.store';
import { useTranslation } from '@/translation';
import { Redirect, router } from 'expo-router';
import { X } from 'lucide-react-native';

export default function App() {
  const { t } = useTranslation();
  const isAuthenticated = authStore(state => state.isAuthenticated);

  // Redirect authenticated users to dashboard
  if (isAuthenticated) {
    return <Redirect href="/(main)/(tabs)/dashboard" />;
  }

  return (
    <Box className="flex-1 bg-background-0">
      {/* Header */}
      <HStack className="items-center justify-between border-b border-outline-100 px-6 py-4">
        <Heading size="3xl" className="text-typography-900">
          {t('settings.title')}
        </Heading>
        <Pressable className="rounded-full p-2">
          <Icon as={X} size="xl" className="text-typography-500" />
        </Pressable>
      </HStack>

      {/* Content */}
      <VStack className="flex-1 gap-8 p-6">
        {/* Theme Section */}
        <VStack space="md">
          <Text size="lg" className="text-typography-900">
            {t('settings.theme')}
          </Text>
          <ModeToggle />
        </VStack>

        {/* Language Section */}
        <LanguageSwitcher />
        <Button
          onPress={() => {
            router.replace('/(auth)/login');
          }}
        >
          <ButtonText>Go to Login</ButtonText>
        </Button>
      </VStack>
    </Box>
  );
}
