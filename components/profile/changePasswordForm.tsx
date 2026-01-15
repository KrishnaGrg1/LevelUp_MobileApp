import React, { useState } from 'react';

import { Box } from '@/components/ui/box';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { useChangePassword } from '@/hooks/useUser';
import { changePasswordInput, changePasswordSchema } from '@/schemas/user/changePassword';
import { useTranslation } from '@/translation';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Eye, EyeOff } from 'lucide-react-native';
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
import { Input, InputField, InputIcon, InputSlot } from '../ui/input';
import { Text } from '../ui/text';
import { Toast, ToastTitle, useToast } from '../ui/toast';

export default function ChangePasswordForm() {
  const { t } = useTranslation();
  const { mutateAsync: changePassword, isPending, error, isSuccess, data: d } = useChangePassword();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toast = useToast();
  const form = useForm<changePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    mode: 'onChange',
  });

  const {
    handleSubmit,
    formState: { errors, isValid },
    setError,
    reset,
  } = form;

  const onSubmit = async (data: changePasswordInput) => {
    try {
      await changePassword(data);
      toast.show({
        placement: 'bottom right',
        duration: 3000,
        render: () => (
          <Toast action="success" variant="solid">
            <ToastTitle>{d?.body.message}</ToastTitle>
          </Toast>
        ),
      });
      reset();
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
      <FormControl isInvalid={!!errors.currentPassword} isRequired>
        <HStack className="mb-1 items-center justify-between">
          <FormControlLabel>
            <FormControlLabelText className="text-typography-900">
              {t('auth.changePassword.currentPassword')}
            </FormControlLabelText>
          </FormControlLabel>
        </HStack>

        <Controller
          control={form.control}
          name="currentPassword"
          render={({ field: { value, onChange } }) => (
            <Input className="border-outline-300" size="lg" isInvalid={!!errors.currentPassword}>
              <InputField
                type={showCurrentPassword ? 'text' : 'password'}
                placeholder={t('auth.changePassword.currentPasswordPlaceholder')}
                value={value}
                onChangeText={txt => {
                  form.clearErrors('root');
                  onChange(txt);
                }}
                autoCapitalize="none"
                autoComplete="current-password"
              />
              <InputSlot
                className="pr-3"
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                <InputIcon
                  as={showCurrentPassword ? EyeOff : Eye}
                  className="text-typography-500"
                />
              </InputSlot>
            </Input>
          )}
        />

        {errors.currentPassword && (
          <FormControlError>
            <FormControlErrorIcon as={AlertCircle} />
            <FormControlErrorText>{errors.currentPassword.message}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>

      {/* New Password Field */}
      <FormControl isInvalid={!!errors.newPassword} isRequired>
        <HStack className="mb-1 items-center justify-between">
          <FormControlLabel>
            <FormControlLabelText className="text-typography-900">
              {t('auth.changePassword.newPassword')}
            </FormControlLabelText>
          </FormControlLabel>
        </HStack>
        <Controller
          control={form.control}
          name="newPassword"
          render={({ field: { value, onChange } }) => (
            <Input className="border-outline-300" size="lg" isInvalid={!!errors.newPassword}>
              <InputField
                type={showNewPassword ? 'text' : 'password'}
                placeholder={t('auth.login.passwordPlaceholder')}
                value={value}
                onChangeText={txt => {
                  form.clearErrors('root');
                  onChange(txt);
                }}
                autoCapitalize="none"
                autoComplete="new-password"
              />
              <InputSlot className="pr-3" onPress={() => setShowNewPassword(!showNewPassword)}>
                <InputIcon as={showNewPassword ? EyeOff : Eye} className="text-typography-500" />
              </InputSlot>
            </Input>
          )}
        />
        {errors.newPassword && (
          <FormControlError>
            <FormControlErrorIcon as={AlertCircle} />
            <FormControlErrorText>{errors.newPassword.message}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>

      {/* Confirm Password Field */}
      <FormControl isInvalid={!!errors.confirmNewPassword} isRequired>
        <HStack className="mb-1 items-center justify-between">
          <FormControlLabel>
            <FormControlLabelText className="text-typography-900">
              {t('auth.changePassword.confirmPassword')}
            </FormControlLabelText>
          </FormControlLabel>
        </HStack>
        <Controller
          control={form.control}
          name="confirmNewPassword"
          render={({ field: { value, onChange } }) => (
            <Input className="border-outline-300" size="lg" isInvalid={!!errors.confirmNewPassword}>
              <InputField
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder={t('auth.changePassword.confirmPasswordPlaceholder')}
                value={value}
                onChangeText={txt => {
                  form.clearErrors('root');
                  onChange(txt);
                }}
                autoCapitalize="none"
                autoComplete="new-password"
              />
              <InputSlot
                className="pr-3"
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <InputIcon
                  as={showConfirmPassword ? EyeOff : Eye}
                  className="text-typography-500"
                />
              </InputSlot>
            </Input>
          )}
        />
        {errors.confirmNewPassword && (
          <FormControlError>
            <FormControlErrorIcon as={AlertCircle} />
            <FormControlErrorText>{errors.confirmNewPassword.message}</FormControlErrorText>
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
            <ButtonText>{t('auth.changePassword.submitting')}</ButtonText>
          </>
        ) : (
          <ButtonText>{t('auth.changePassword.submit')}</ButtonText>
        )}
      </Button>
    </Box>
  );
}
