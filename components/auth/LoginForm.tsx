import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';

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

import { useLogin } from '@/hooks/useAuth';
import { LoginInput, loginSchema } from '@/schemas/auth/login';
import { useTranslation } from '@/translation';
import { Link } from 'expo-router';
import { AlertCircle, Eye, EyeOff, Github } from 'lucide-react-native';

export function LoginForm() {
  const { t } = useTranslation();
  const { mutate: login, isPending, error } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<'google' | 'github' | null>(null);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const {
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    setError,
  } = form;

  const onSubmit = async (data: LoginInput) => {
    try {
      login(data);
    } catch (err: any) {
      const errorMessage = err?.message || t('error.auth.loginFailed');
      setError('root', {
        type: 'server',
        message: errorMessage,
      });
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    try {
      setLoadingProvider(provider);

      // TODO: Implement OAuth login with proper provider
      Alert.alert(
        t('auth.comingSoon'),
        t(`auth.${provider}OAuthComingSoon`, `${provider} login will be available soon`),
      );

      // Placeholder for OAuth implementation
      // const oauthUrl = await getOAuthUrl(provider);
      // await WebBrowser.openAuthSessionAsync(oauthUrl);
    } catch (error) {
      console.error(`${provider} OAuth error:`, error);
      Alert.alert(
        t('error.auth.oauthFailed'),
        t(`error.auth.${provider}_oauth_failed`, `${provider} login failed`),
      );
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <VStack space="lg" className="mb-6">
      {/* Social Login Buttons */}
      <HStack space="md">
        <Button
          variant="outline"
          className="flex-1 border-outline-300"
          onPress={() => handleOAuthLogin('google')}
          isDisabled={isPending || loadingProvider !== null}
        >
          {loadingProvider === 'google' ? (
            <ButtonSpinner />
          ) : (
            <ButtonText className="text-typography-900">
              {t('auth.login.loginWithGoogle')}
            </ButtonText>
          )}
        </Button>
        <Button
          variant="outline"
          className="flex-1 border-outline-300"
          onPress={() => handleOAuthLogin('github')}
          isDisabled={isPending || loadingProvider !== null}
        >
          {loadingProvider === 'github' ? (
            <ButtonSpinner />
          ) : (
            <>
              <Icon as={Github} size="sm" className="mr-2 text-typography-900" />
              <ButtonText className="text-typography-900">
                {t('auth.login.loginWithGitHub')}
              </ButtonText>
            </>
          )}
        </Button>
      </HStack>

      {/* Divider */}
      <HStack space="md" className="items-center">
        <Box className="h-[1px] flex-1 bg-outline-200" />
        <Text size="sm" className="text-typography-400">
          {t('auth.or')}
        </Text>
        <Box className="h-[1px] flex-1 bg-outline-200" />
      </HStack>

      {/* Email Field */}
      <FormControl isInvalid={!!errors.email} isRequired>
        <FormControlLabel>
          <FormControlLabelText className="text-typography-900">
            {t('auth.login.email')}
          </FormControlLabelText>
        </FormControlLabel>
        <Input className="border-outline-300" size="lg" isInvalid={!!errors.email}>
          <InputField
            type="text"
            placeholder={t('auth.login.emailPlaceholder')}
            onChangeText={txt => setValue('email', txt, { shouldValidate: true })}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
        </Input>
        {errors.email && (
          <FormControlError>
            <FormControlErrorIcon as={AlertCircle} />
            <FormControlErrorText>{errors.email.message}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>

      {/* Password Field */}
      <FormControl isInvalid={!!errors.password} isRequired>
        <HStack className="mb-1 items-center justify-between">
          <FormControlLabel>
            <FormControlLabelText className="text-typography-900">
              {t('auth.login.password')}
            </FormControlLabelText>
          </FormControlLabel>
          <Link href="/(auth)/forgetPassword" asChild>
            <Pressable>
              <Text size="sm" className="font-medium text-typography-900 underline">
                {t('auth.login.forgotPasswordLink')}
              </Text>
            </Pressable>
          </Link>
        </HStack>
        <Input className="border-outline-300" size="lg" isInvalid={!!errors.password}>
          <InputField
            type={showPassword ? 'text' : 'password'}
            placeholder={t('auth.login.passwordPlaceholder')}
            onChangeText={txt => setValue('password', txt, { shouldValidate: true })}
            autoCapitalize="none"
            autoComplete="password"
          />
          <InputSlot className="pr-3" onPress={() => setShowPassword(!showPassword)}>
            <InputIcon as={showPassword ? EyeOff : Eye} className="text-typography-500" />
          </InputSlot>
        </Input>
        {errors.password && (
          <FormControlError>
            <FormControlErrorIcon as={AlertCircle} />
            <FormControlErrorText>{errors.password.message}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>

      {/* Error Message */}
      {(error || errors.root) && (
        <Box className="rounded-lg border border-error-200 bg-error-50 p-3">
          <Text className="text-center text-sm text-error-700">
            {errors.root?.message || error?.message || t('error.auth.loginFailed')}
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
            <ButtonText>{t('auth.login.loggingIn')}</ButtonText>
          </>
        ) : (
          <ButtonText>{t('auth.login.submit')}</ButtonText>
        )}
      </Button>

      {/* Terms */}
      <Text className="text-center text-xs text-typography-400">
        {String(t('auth.agreeTo'))}{' '}
        <Text className="text-typography-900 underline">{String(t('auth.terms'))}</Text>{' '}
        {String(t('auth.and'))}{' '}
        <Text className="text-typography-900 underline">{String(t('auth.privacyPolicy'))}</Text>.
      </Text>
    </VStack>
  );
}
