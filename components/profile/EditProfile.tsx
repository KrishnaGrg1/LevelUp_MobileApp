import React from 'react';

import { Box } from '@/components/ui/box';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { useEditProfile } from '@/hooks/useUser';
import { editProfileInput, editProfileSchema } from '@/schemas/user/editUser';
import authStore from '@/stores/auth.store';
import { useTranslation } from '@/translation';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '../ui/form-control';
import { HStack } from '../ui/hstack';
import { Input, InputField } from '../ui/input';
import { Text } from '../ui/text';
import { Toast, ToastTitle, useToast } from '../ui/toast';

export default function EditProfileForm() {
  const { t } = useTranslation();
  const user = authStore.getState().user;
  const { mutate, isPending, error, isSuccess, data: d } = useEditProfile();
  const toast = useToast();
  const form = useForm<editProfileInput>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      username: user?.UserName || '',
    },
    mode: 'onChange',
  });

  const {
    handleSubmit,
    formState: { errors, isValid },
    setError,
    reset,
  } = form;

  const onSubmit = async (data: editProfileInput) => {
    try {
      await mutate(data);
      toast.show({
        placement: 'bottom right',
        duration: 3000,
        render: () => {
          return (
            <Toast action="muted" variant="solid">
              <ToastTitle> {d?.body.message}</ToastTitle>
            </Toast>
          );
        },
      });
      reset({
        username: '',
      });
    } catch (err: any) {
      const errorMessage = err?.message || t('error.auth.loginFailed');
      setError('root', {
        type: 'server',
        message: errorMessage,
      });
    }
  };
  return (
    <Box>
      {/* CurrentPassword Field */}
      <FormControl isInvalid={!!errors.username} isRequired>
        <HStack className="mb-1 items-center justify-between">
          <FormControlLabel>
            <FormControlLabelText className="text-typography-900">
              {t('auth.register.username')}
            </FormControlLabelText>
          </FormControlLabel>
        </HStack>

        <Controller
          control={form.control}
          name="username"
          render={({ field: { value, onChange } }) => (
            <Input className="border-outline-300" size="lg" isInvalid={!!errors.username}>
              <InputField
                type="text"
                placeholder={t('auth.register.usernamePlaceholder')}
                value={value}
                onChangeText={txt => {
                  form.clearErrors('root');
                  onChange(txt);
                }}
                autoCapitalize="none"
                autoComplete="username"
              />
            </Input>
          )}
        />

        {errors.username && (
          <FormControlError>
            <FormControlErrorIcon as={AlertCircle} />
            <FormControlErrorText>{errors.username.message}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>

      {/* Error Message */}
      {(error || errors.root) && (
        <Box className="mt-2 rounded-lg border border-error-200 bg-error-50 p-3">
          <Text className="text-center text-sm text-error-700">
            {errors.root?.message || error?.message || t('error.auth.loginFailed')}
          </Text>
        </Box>
      )}
      {isSuccess && (
        <Box className="rounded-lg border border-success-200 bg-success-50 p-3">
          <Text className="text-center text-sm text-success-700">{d.body.message}</Text>
        </Box>
      )}
      <Button
        className="mt-4 bg-typography-900"
        onPress={handleSubmit(onSubmit)}
        disabled={isPending || !isValid}
      >
        {isPending ? (
          <>
            <ButtonSpinner className="mr-2" />
            <ButtonText>{t('profile.form.submitting')}</ButtonText>
          </>
        ) : (
          <ButtonText>{t('profile.form.submit')}</ButtonText>
        )}
      </Button>
    </Box>
  );
}
