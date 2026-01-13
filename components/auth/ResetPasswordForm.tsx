import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';

import { Box } from '@/components/ui/box';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

import { useResetPassword } from '@/hooks/useAuth';
import { ResetPasswordInput, ResetPasswordSchema } from '@/schemas/auth/resetPassword';
import authStore from '@/stores/auth.store';
import { useTranslation } from '@/translation';
import { useRouter } from 'expo-router';
import { AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react-native';

export function ResetPasswordForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const { mutate: resetPassword, isPending, error } = useResetPassword();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { user } = authStore.getState();

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      userId: user?.id || '',
      otp: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const {
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    setError,
  } = form;

  const onSubmit = async (data: ResetPasswordInput) => {
    try {
      const { confirmPassword, ...apiData } = data;
      await resetPassword(apiData);
    } catch (err: any) {
      const errorMessage = err?.message || t('error.auth.resetPasswordFailed');
      setError('root', {
        type: 'server',
        message: errorMessage,
      });
    }
  };

  return (
    <VStack space="lg" className="mb-6">
      {/* Back Button */}
      <Pressable onPress={() => router.back()} className="mb-4">
        <HStack space="sm" className="items-center">
          <Icon as={ArrowLeft} size="lg" className="text-typography-900" />
          <Text className="text-typography-900">{t('auth.back')}</Text>
        </HStack>
      </Pressable>

      {/* OTP Field */}
      <FormControl isInvalid={!!errors.otp} isRequired>
        <FormControlLabel>
          <FormControlLabelText className="text-typography-900">
            {t('auth.resetPassword.otp')}
          </FormControlLabelText>
        </FormControlLabel>
        <Input className="border-outline-300" size="lg" isInvalid={!!errors.otp}>
          <InputField
            type="text"
            placeholder="000000"
            onChangeText={txt => setValue('otp', txt, { shouldValidate: true })}
            keyboardType="number-pad"
            maxLength={6}
          />
        </Input>
        {errors.otp && (
          <FormControlError>
            <FormControlErrorIcon as={AlertCircle} />
            <FormControlErrorText>{errors.otp.message}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>

      {/* New Password Field */}
      <FormControl isInvalid={!!errors.newPassword} isRequired>
        <FormControlLabel>
          <FormControlLabelText className="text-typography-900">
            {t('auth.resetPassword.newPassword')}
          </FormControlLabelText>
        </FormControlLabel>
        <Input className="border-outline-300" size="lg" isInvalid={!!errors.newPassword}>
          <InputField
            type={showPassword ? 'text' : 'password'}
            placeholder={t('auth.resetPassword.newPasswordPlaceholder')}
            onChangeText={txt => setValue('newPassword', txt, { shouldValidate: true })}
            autoCapitalize="none"
          />
          <InputSlot className="pr-3" onPress={() => setShowPassword(!showPassword)}>
            <InputIcon as={showPassword ? EyeOff : Eye} className="text-typography-500" />
          </InputSlot>
        </Input>
        {errors.newPassword && (
          <FormControlError>
            <FormControlErrorIcon as={AlertCircle} />
            <FormControlErrorText>{errors.newPassword.message}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>

      {/* Confirm Password Field */}
      <FormControl isInvalid={!!errors.confirmPassword} isRequired>
        <FormControlLabel>
          <FormControlLabelText className="text-typography-900">
            {t('auth.resetPassword.confirmPassword')}
          </FormControlLabelText>
        </FormControlLabel>
        <Input className="border-outline-300" size="lg" isInvalid={!!errors.confirmPassword}>
          <InputField
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder={t('auth.resetPassword.confirmPasswordPlaceholder')}
            onChangeText={txt => setValue('confirmPassword', txt, { shouldValidate: true })}
            autoCapitalize="none"
          />
          <InputSlot className="pr-3" onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <InputIcon as={showConfirmPassword ? EyeOff : Eye} className="text-typography-500" />
          </InputSlot>
        </Input>
        {errors.confirmPassword && (
          <FormControlError>
            <FormControlErrorIcon as={AlertCircle} />
            <FormControlErrorText>{errors.confirmPassword.message}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>

      {/* Error Message */}
      {(error || errors.root) && (
        <Box className="rounded-lg border border-error-200 bg-error-50 p-3">
          <Text className="text-center text-sm text-error-700">
            {errors.root?.message || error?.message || t('error.auth.resetPasswordFailed')}
          </Text>
        </Box>
      )}

      {/* Submit Button */}
      <Button
        size="lg"
        className="mt-4 bg-typography-900"
        onPress={handleSubmit(onSubmit)}
        isDisabled={isPending || !isValid}
      >
        {isPending ? (
          <>
            <ButtonSpinner className="mr-2" />
            <ButtonText>{t('auth.resetPassword.resetting', 'Resetting...')}</ButtonText>
          </>
        ) : (
          <ButtonText>{t('auth.resetPassword.submit')}</ButtonText>
        )}
      </Button>
    </VStack>
  );
}
