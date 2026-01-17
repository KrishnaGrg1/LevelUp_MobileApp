import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Avatar, AvatarFallbackText } from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import authStore from '@/stores/auth.store';
import { useTranslation } from '@/translation';
import { useRouter } from 'expo-router';
import { Coins, TrendingUp, Zap } from 'lucide-react-native';
import React from 'react';
import { Pressable } from 'react-native';

export function WelcomeHeader() {
  const router = useRouter();
  const user = authStore(state => state.user);
  const { t } = useTranslation();

  const handleProfilePress = () => {
    router.push('/(main)/profile' as any);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // const { data: userProfile } = useUserProfile();
  // Fallback to store user if profile fetch hasn't completed
  const displayUser = user;

  return (
    <VStack className="border-b border-outline-200 bg-background-0 px-4 py-3" space="sm">
      <HStack className="items-center justify-between">
        {/* Profile Avatar & Greeting */}
        <Pressable onPress={handleProfilePress}>
          <HStack space="sm" className="items-center">
            <Avatar size="md">
              <AvatarFallbackText>{getInitials(displayUser?.UserName || 'User')}</AvatarFallbackText>
            </Avatar>
            <VStack>
              <Text className="font-bold text-typography-900 dark:text-white">
                {t('dashboard.greeting')}, {displayUser?.UserName || 'User'} 👋
              </Text>
              <Text className="text-xs text-typography-500 dark:text-typography-400">{t('dashboard.tagline')}</Text>
            </VStack>
          </HStack>
        </Pressable>

        {/* Language Switcher */}
        <LanguageSwitcher />
      </HStack>

      {/* Stats Row */}
      <HStack space="xs" className="mt-1">
        {/* Level Card */}
        <Box className="flex-1 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 p-2.5 shadow-sm">
          <HStack space="xs" className="items-center">
            <Box className="rounded-full bg-white/20 p-1.5">
              <TrendingUp size={14} color="#fff" />
            </Box>
            <VStack className="flex-1">
              <Text className="text-[10px] font-medium text-black/80">{t('dashboard.stats.level')}</Text>
              <Text className="text-lg font-bold text-black">{displayUser?.level || 0}</Text>
            </VStack>
          </HStack>
        </Box>

        {/* XP Card */}
        <Box className="flex-1 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 shadow-sm">
          <HStack space="xs" className="items-center">
            <Box className="rounded-full bg-white/20 p-1.5">
              <Zap size={14} color="#fff" />
            </Box>
            <VStack className="flex-1">
              <Text className="text-[10px] font-medium text-black/80">{t('dashboard.stats.xp')}</Text>
              <Text className="text-lg font-bold text-black">{displayUser?.xp || 0}</Text>
            </VStack>
          </HStack>
        </Box>

        {/* Tokens Card */}
        <Box className="flex-1 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 p-2.5 shadow-sm">
          <HStack space="xs" className="items-center">
            <Box className="rounded-full bg-white/20 p-1.5">
              <Coins size={14} color="#fff" />
            </Box>
            <VStack className="flex-1">
              <Text className="text-[10px] font-medium text-black/80">{t('dashboard.stats.tokens')}</Text>
              <Text className="text-lg font-bold text-black">{displayUser?.tokens || 0}</Text>
            </VStack>
          </HStack>
        </Box>
      </HStack>
    </VStack>
  );
}
