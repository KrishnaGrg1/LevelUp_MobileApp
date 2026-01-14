import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';

import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';

import { Box } from '@/components/ui/box';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Center } from '@/components/ui/center';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

import { useForgetPassword } from '@/hooks/useAuth';
import { ForgetPasswordInput, ForgetPasswordSchema } from '@/schemas/auth/forgetPassword';
import { useTranslation } from '@/translation';
import { router } from 'expo-router';
import { AlertCircle } from 'lucide-react-native';

export function ForgetPasswordForm() {
  const { t } = useTranslation();
  const { mutate: forgetPassword, isPending, error } = useForgetPassword();

  const form = useForm<ForgetPasswordInput>({
    resolver: zodResolver(ForgetPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  });

  const {
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    setError,
  } = form;

  const onSubmit = async (data: ForgetPasswordInput) => {
    try {
      await forgetPassword(data);
    } catch (err: any) {
      const errorMessage = err?.message || t('error.auth.forgetPasswordFailed');
      setError('root', {
        type: 'server',
        message: errorMessage,
      });
    }
  };

  return (
    <VStack space="lg" className="mb-6">
      {/* Email Field */}
      <FormControl isInvalid={!!errors.email} isRequired>
        <FormControlLabel>
          <FormControlLabelText className="text-typography-900">
            {t('auth.forgetPassword.email')}
          </FormControlLabelText>
        </FormControlLabel>
        <Input className="border-outline-300" size="lg" isInvalid={!!errors.email}>
          <InputField
            type="text"
            placeholder={t('auth.forgetPassword.emailPlaceholder')}
            onChangeText={txt => setValue('email', txt, { shouldValidate: true })}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
        </Input>
        {!errors.email && (
          <FormControlHelper>
            <FormControlHelperText>
              {t('auth.forgetPassword.helperText', "We'll send a reset code to this email")}
            </FormControlHelperText>
          </FormControlHelper>
        )}
        {errors.email && (
          <FormControlError>
            <FormControlErrorIcon as={AlertCircle} />
            <FormControlErrorText>{errors.email.message}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>

      {/* Error Message */}
      {(error || errors.root) && (
        <Box className="rounded-lg border border-error-200 bg-error-50 p-3">
          <Text className="text-center text-sm text-error-700">
            {errors.root?.message || error?.message || t('error.auth.forgetPasswordFailed')}
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
            <ButtonText>{t('auth.forgetPassword.sending', 'Sending...')}</ButtonText>
          </>
        ) : (
          <ButtonText>{t('auth.forgetPassword.submit')}</ButtonText>
        )}
      </Button>

      {/* Back to Login */}
      <Center className="mt-4">
        <Text className="text-center text-sm text-typography-500">
          {t('auth.forgetPassword.rememberPassword', 'Remember your password?')}{' '}
          <Text
            onPress={() => router.replace('/(auth)/login')}
            className="font-medium text-typography-900 underline"
          >
            {t('auth.forgetPassword.loginLink', 'Log in')}
          </Text>
        </Text>
      </Center>
    </VStack>
  );
}
