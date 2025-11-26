import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "react-native";

import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";

import { Box } from "@/components/ui/box";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { useRegister } from "@/hooks/useAuth";
import { RegisterInput, registerSchema } from "@/schemas/auth/register";
import { useTranslation } from "@/translation";
import { AlertCircle, Eye, EyeOff, Github } from "lucide-react-native";

export function RegisterForm() {
  const { t } = useTranslation();
  const { mutate: register, isPending, error } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<
    "google" | "github" | null
  >(null);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const {
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    setError,
  } = form;

  const onSubmit = async (data: RegisterInput) => {
    try {
      await register(data);
    } catch (err: any) {
      const errorMessage = err?.message || t("error.auth.registerFailed");
      setError("root", {
        type: "server",
        message: errorMessage,
      });
    }
  };

  const handleOAuthRegister = async (provider: "google" | "github") => {
    try {
      setLoadingProvider(provider);

      // TODO: Implement OAuth registration with proper provider
      Alert.alert(
        t("auth.comingSoon"),
        t(
          `auth.${provider}OAuthComingSoon`,
          `${provider} registration will be available soon`
        )
      );

      // Placeholder for OAuth implementation
      // const oauthUrl = await getOAuthUrl(provider, 'register');
      // await WebBrowser.openAuthSessionAsync(oauthUrl);
    } catch (error) {
      console.error(`${provider} OAuth error:`, error);
      Alert.alert(
        t("error.auth.oauthFailed"),
        t(
          `error.auth.${provider}_oauth_failed`,
          `${provider} registration failed`
        )
      );
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <VStack space="lg" className="mb-6">
      {/* Social Register Buttons */}
      <HStack space="md">
        <Button
          variant="outline"
          className="flex-1 border-outline-300"
          onPress={() => handleOAuthRegister("google")}
          isDisabled={isPending || loadingProvider !== null}
        >
          {loadingProvider === "google" ? (
            <ButtonSpinner />
          ) : (
            <ButtonText className="text-typography-900">
              {t("auth.login.loginWithGoogle")}
            </ButtonText>
          )}
        </Button>
        <Button
          variant="outline"
          className="flex-1 border-outline-300"
          onPress={() => handleOAuthRegister("github")}
          isDisabled={isPending || loadingProvider !== null}
        >
          {loadingProvider === "github" ? (
            <ButtonSpinner />
          ) : (
            <>
              <Icon
                as={Github}
                size="sm"
                className="mr-2 text-typography-900"
              />
              <ButtonText className="text-typography-900">
                {t("auth.login.loginWithGitHub")}
              </ButtonText>
            </>
          )}
        </Button>
      </HStack>

      {/* Divider */}
      <HStack space="md" className="items-center">
        <Box className="h-[1px] flex-1 bg-outline-200" />
        <Text size="sm" className="text-typography-400">
          {t("auth.or")}
        </Text>
        <Box className="h-[1px] flex-1 bg-outline-200" />
      </HStack>

      {/* Username Field */}
      <FormControl isInvalid={!!errors.username} isRequired>
        <FormControlLabel>
          <FormControlLabelText className="text-typography-900">
            {t("auth.register.username")}
          </FormControlLabelText>
        </FormControlLabel>
        <Input
          className="border-outline-300"
          size="lg"
          isInvalid={!!errors.username}
        >
          <InputField
            type="text"
            placeholder={t("auth.register.usernamePlaceholder")}
            onChangeText={(txt) =>
              setValue("username", txt, { shouldValidate: true })
            }
            autoCapitalize="none"
            autoComplete="username"
          />
        </Input>
        {errors.username && (
          <FormControlError>
            <FormControlErrorIcon as={AlertCircle} />
            <FormControlErrorText>
              {errors.username.message}
            </FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>

      {/* Email Field */}
      <FormControl isInvalid={!!errors.email} isRequired>
        <FormControlLabel>
          <FormControlLabelText className="text-typography-900">
            {t("auth.register.email")}
          </FormControlLabelText>
        </FormControlLabel>
        <Input
          className="border-outline-300"
          size="lg"
          isInvalid={!!errors.email}
        >
          <InputField
            type="text"
            placeholder={t("auth.register.emailPlaceholder")}
            onChangeText={(txt) =>
              setValue("email", txt, { shouldValidate: true })
            }
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
        <FormControlLabel>
          <FormControlLabelText className="text-typography-900">
            {t("auth.register.password")}
          </FormControlLabelText>
        </FormControlLabel>
        <Input
          className="border-outline-300"
          size="lg"
          isInvalid={!!errors.password}
        >
          <InputField
            type={showPassword ? "text" : "password"}
            placeholder={t("auth.register.passwordPlaceholder")}
            onChangeText={(txt) =>
              setValue("password", txt, { shouldValidate: true })
            }
            autoCapitalize="none"
            autoComplete="password"
          />
          <InputSlot
            className="pr-3"
            onPress={() => setShowPassword(!showPassword)}
          >
            <InputIcon
              as={showPassword ? EyeOff : Eye}
              className="text-typography-500"
            />
          </InputSlot>
        </Input>
        {errors.password && (
          <FormControlError>
            <FormControlErrorIcon as={AlertCircle} />
            <FormControlErrorText>
              {errors.password.message}
            </FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>

      {/* Error Message */}
      {(error || errors.root) && (
        <Box className="rounded-lg bg-error-50 border border-error-200 p-3">
          <Text className="text-center text-sm text-error-700">
            {errors.root?.message ||
              error?.message ||
              t("error.auth.registerFailed")}
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
            <ButtonText>{t("auth.register.registering")}</ButtonText>
          </>
        ) : (
          <ButtonText>{t("auth.register.submit")}</ButtonText>
        )}
      </Button>

      {/* Terms */}
      <Text className="text-center text-xs text-typography-400">
        {String(t("auth.agreeToSignup"))}{" "}
        <Text className="text-typography-900 underline">
          {String(t("auth.terms"))}
        </Text>{" "}
        {String(t("auth.and"))}{" "}
        <Text className="text-typography-900 underline">
          {String(t("auth.privacyPolicy"))}
        </Text>
        .
      </Text>
    </VStack>
  );
}
