import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

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
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { useRegister } from "@/hooks/useAuth";
import { RegisterInput, registerSchema } from "@/schemas/auth/register";
import { useTranslation } from "@/translation";
import { Link } from "expo-router";
import {
  AlertCircle,
  Eye,
  EyeOff,
  Github,
  Sparkles,
} from "lucide-react-native";

export default function RegisterScreen() {
  const { t } = useTranslation();
  const { mutate: register, isPending } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<
    "google" | "github" | null
  >(null);

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterInput) => {
    register(data);
  };

  const handleOAuthRegister = async (provider: "google" | "github") => {
    setLoadingProvider(provider);
    try {
      // TODO: Implement OAuth registration
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background-0">
      <Box className="flex-1 px-6 py-8">
        {/* Logo/Icon */}
        <Center className="mb-6 mt-12">
          <Box className="h-12 w-12 items-center justify-center rounded-lg border-2 border-typography-900">
            <Icon as={Sparkles} size="xl" className="text-typography-900" />
          </Box>
        </Center>

        {/* Title */}
        <Heading size="2xl" className="mb-2 text-center text-typography-900">
          {t("auth.register.title")}
        </Heading>

        {/* Subtitle */}
        <Text className="mb-8 text-center text-typography-500">
          {t("auth.register.hasAccount")}{" "}
          <Link href="/(auth)/login" asChild>
            <Text className="font-medium text-typography-900 underline">
              {t("auth.register.loginLink")}
            </Text>
          </Link>
        </Text>

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
                <FormControlErrorText>
                  {errors.email.message}
                </FormControlErrorText>
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

          {/* Submit Button */}
          <Button
            size="lg"
            className="mt-4 bg-typography-900"
            onPress={handleSubmit(onSubmit)}
            isDisabled={isPending}
          >
            {isPending ? (
              <>
                <ButtonSpinner className="mr-2" />
                <ButtonText>{t("auth.register.submit")}</ButtonText>
              </>
            ) : (
              <ButtonText>{t("auth.register.submit")}</ButtonText>
            )}
          </Button>

          {/* Terms */}
          <Text className="text-center text-xs text-typography-400">
            {t("auth.agreeToSignup")}{" "}
            <Text className="text-typography-900 underline">
              {t("auth.terms")}
            </Text>{" "}
            {t("auth.and")}{" "}
            <Text className="text-typography-900 underline">
              {t("auth.privacyPolicy")}
            </Text>
            .
          </Text>
        </VStack>
      </Box>
    </ScrollView>
  );
}
