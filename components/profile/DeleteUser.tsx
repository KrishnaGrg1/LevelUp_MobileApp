import React from 'react';
import { Alert } from 'react-native';

import { Box } from '@/components/ui/box';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { useDeleteUser } from '@/hooks/useUser';
import { useTranslation } from '@/translation';
import { router } from 'expo-router';
import { Text } from '../ui/text';
import { Toast, ToastTitle, useToast } from '../ui/toast';

export default function DeleteUser() {
  const { t } = useTranslation();
  const { mutateAsync, isPending, error } = useDeleteUser();
  const toast = useToast();

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: onConfirmDelete,
        },
      ],
    );
  };

  const onConfirmDelete = async () => {
    try {
      const result = await mutateAsync();
      toast.show({
        placement: 'bottom right',
        duration: 3000,
        render: () => (
          <Toast action="success" variant="solid">
            <ToastTitle>{result.body.message}</ToastTitle>
          </Toast>
        ),
      });
      router.replace('/(auth)/login');
    } catch (err: any) {
      toast.show({
        placement: 'bottom right',
        duration: 3000,
        render: () => (
          <Toast action="error" variant="solid">
            <ToastTitle>{err?.message || 'Failed to delete account'}</ToastTitle>
          </Toast>
        ),
      });
    }
  };

  return (
    <Box className="p-4">
      {error && (
        <Box className="mb-4 rounded-lg border border-error-200 bg-error-50 p-3">
          <Text className="text-center text-sm text-error-700">
            {error?.message || 'Failed to delete account'}
          </Text>
        </Box>
      )}

      <Button className="bg-error-600" onPress={handleDeleteAccount} disabled={isPending}>
        {isPending ? (
          <>
            <ButtonSpinner className="mr-2" />
            <ButtonText>Deleting...</ButtonText>
          </>
        ) : (
          <ButtonText>Delete My Account</ButtonText>
        )}
      </Button>
    </Box>
  );
}
