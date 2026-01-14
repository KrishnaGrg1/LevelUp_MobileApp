import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Avatar, AvatarFallbackText } from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import authStore from '@/stores/auth.store';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';

export function WelcomeHeader() {
  const router = useRouter();
  const user = authStore(state => state.user);

  const handleProfilePress = () => {
    router.push('/(main)/profile');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <HStack
      className="items-center border-b border-outline-200 bg-background-0 px-4 py-3"
      space="md"
    >
      {/* Profile Avatar */}
      <Pressable onPress={handleProfilePress}>
        <Avatar size="md">
          <AvatarFallbackText>{getInitials(user?.UserName || 'User')}</AvatarFallbackText>
        </Avatar>
      </Pressable>

      {/* Spacer */}
      <Box className="flex-1" />

      {/* Language Switcher */}
      <LanguageSwitcher />
    </HStack>
  );
}
