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
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

import { useVerifyEmail } from '@/hooks/useAuth';
import { VerifyInput, VerifySchema } from '@/schemas/auth/verifyEmail';
import authStore from '@/stores/auth.store';
import { useTranslation } from '@/translation';
import { useRouter } from 'expo-router';
import { AlertCircle, ArrowLeft } from 'lucide-react-native';

export function VerifyEmailForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const { mutate: verifyEmail, isPending, error } = useVerifyEmail();
  const userId = authStore.getState().user?.id;

  const form = useForm<VerifyInput>({
    resolver: zodResolver(VerifySchema),
    defaultValues: {
      userId: userId || '',
      otp: '',
    },
    mode: 'onChange',
  });

  const {
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    setError,
  } = form;

  const onSubmit = async (data: VerifyInput) => {
    try {
      await verifyEmail({ ...data, userId: userId || data.userId });
    } catch (err: any) {
      const errorMessage = err?.message || t('error.auth.verifyEmailFailed');
      setError('root', {
        type: 'server',
        message: errorMessage,
      });
    }
  };

  const handleResendCode = () => {
    // TODO: Implement resend code logic
    console.log('Resend code');
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
            {t('auth.verify.otp')}
          </FormControlLabelText>
        </FormControlLabel>
        <Input className="border-outline-300" size="lg" isInvalid={!!errors.otp}>
          <InputField
            type="text"
            placeholder="000000"
            onChangeText={txt => setValue('otp', txt, { shouldValidate: true })}
            keyboardType="number-pad"
            maxLength={6}
            textAlign="center"
            className="text-2xl font-semibold tracking-widest"
          />
        </Input>
        {!errors.otp && (
          <FormControlHelper>
            <FormControlHelperText>
              {t('auth.verify.helperText', 'Enter the 6-digit code sent to your email')}
            </FormControlHelperText>
          </FormControlHelper>
        )}
        {errors.otp && (
          <FormControlError>
            <FormControlErrorIcon as={AlertCircle} />
            <FormControlErrorText>{errors.otp.message}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>

      {/* Error Message */}
      {(error || errors.root) && (
        <Box className="rounded-lg border border-error-200 bg-error-50 p-3">
          <Text className="text-center text-sm text-error-700">
            {errors.root?.message || error?.message || t('error.auth.verifyEmailFailed')}
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
            <ButtonText>{t('auth.verify.verifying', 'Verifying...')}</ButtonText>
          </>
        ) : (
          <ButtonText>{t('auth.verify.submit')}</ButtonText>
        )}
      </Button>

      {/* Resend Code */}
      <Center className="mt-4">
        <Text className="text-center text-sm text-typography-500">
          {t('auth.verify.didntReceive', "Didn't receive the code?")}{' '}
          <Text onPress={handleResendCode} className="font-medium text-typography-900 underline">
            {t('auth.verify.resend', 'Resend')}
          </Text>
        </Text>
      </Center>
    </VStack>
  );
}
