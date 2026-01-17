import { router } from 'expo-router';
import React from 'react';
import { ScrollView } from 'react-native';

import ChangePasswordForm from '@/components/profile/changePasswordForm';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { useTranslation } from '@/translation';

// import EditProfileForm from '@/components/profile/EditProfileForm';

export default function EditProfileScreen() {
  const { t } = useTranslation();
  return (
    <ScrollView className="flex-1 bg-background-0 px-6 pt-12">
      <Box className="mb-6 flex-row items-center justify-between">
        <Heading size="lg">{t('auth.changePassword.title')}</Heading>
        <Pressable onPress={() => router.back()}>
          <Text className="font-medium text-primary-500">{t('auth.cancel')}</Text>
        </Pressable>
      </Box>

      <ChangePasswordForm />
    </ScrollView>
  );
}
