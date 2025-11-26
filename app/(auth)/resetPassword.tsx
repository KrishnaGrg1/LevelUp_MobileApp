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
import { Pressable } from "@/components/ui/pressable";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { useResetPassword } from "@/hooks/useAuth";
import {
  ResetPasswordInput,
  ResetPasswordSchema,
} from "@/schemas/auth/resetPassword";
import authStore from "@/stores/auth.store";
import { useTranslation } from "@/translation";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
} from "lucide-react-native";

export default function ResetPasswordScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const { mutate: resetPassword, isPending, error } = useResetPassword();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { user } = authStore.getState();
  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      userId: user?.id || "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const errorMessage = error
    ? error.message
    : t("error.auth.resetPasswordFailed");
  const onSubmit = async (data: ResetPasswordInput) => {
    const { confirmPassword, ...apiData } = data;
    await resetPassword(apiData);
  };

  return (
    <ScrollView className="flex-1 bg-background-0">
      <Box className="flex-1 px-6 py-8">
        {/* Back Button */}
        <Pressable onPress={() => router.back()} className="mb-8 mt-4">
          <HStack space="sm" className="items-center">
            <Icon as={ArrowLeft} size="lg" className="text-typography-900" />
            <Text className="text-typography-900">{t("auth.back")}</Text>
          </HStack>
        </Pressable>

        {/* Icon */}
        <Center className="mb-6">
          <Box className="h-16 w-16 items-center justify-center rounded-full bg-background-50 border-2 border-outline-200">
            <Icon as={KeyRound} size="xl" className="text-typography-900" />
          </Box>
        </Center>

        {/* Title */}
        <Heading size="2xl" className="mb-2 text-center text-typography-900">
          {t("auth.resetPassword.title")}
        </Heading>

        {/* Subtitle */}
        <Text className="mb-8 text-center text-typography-500">
          {t("auth.resetPassword.subtitle")}
        </Text>

        <VStack space="lg" className="mb-6">
          {/* OTP Field */}
          <FormControl isInvalid={!!errors.otp} isRequired>
            <FormControlLabel>
              <FormControlLabelText className="text-typography-900">
                {t("auth.resetPassword.otp")}
              </FormControlLabelText>
            </FormControlLabel>
            <Input
              className="border-outline-300"
              size="lg"
              isInvalid={!!errors.otp}
            >
              <InputField
                type="text"
                placeholder="000000"
                onChangeText={(txt) =>
                  setValue("otp", txt, { shouldValidate: true })
                }
                keyboardType="number-pad"
                maxLength={6}
              />
            </Input>
            {errors.otp && (
              <FormControlError>
                <FormControlErrorIcon as={AlertCircle} />
                <FormControlErrorText>
                  {errors.otp.message}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          {/* New Password Field */}
          <FormControl isInvalid={!!errors.newPassword} isRequired>
            <FormControlLabel>
              <FormControlLabelText className="text-typography-900">
                {t("auth.resetPassword.newPassword")}
              </FormControlLabelText>
            </FormControlLabel>
            <Input
              className="border-outline-300"
              size="lg"
              isInvalid={!!errors.newPassword}
            >
              <InputField
                type={showPassword ? "text" : "password"}
                placeholder={t("auth.resetPassword.newPasswordPlaceholder")}
                onChangeText={(txt) =>
                  setValue("newPassword", txt, { shouldValidate: true })
                }
                autoCapitalize="none"
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
            {errors.newPassword && (
              <FormControlError>
                <FormControlErrorIcon as={AlertCircle} />
                <FormControlErrorText>
                  {errors.newPassword.message}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          {/* Confirm Password Field */}
          <FormControl isInvalid={!!errors.confirmPassword} isRequired>
            <FormControlLabel>
              <FormControlLabelText className="text-typography-900">
                {t("auth.resetPassword.confirmPassword")}
              </FormControlLabelText>
            </FormControlLabel>
            <Input
              className="border-outline-300"
              size="lg"
              isInvalid={!!errors.confirmPassword}
            >
              <InputField
                type={showConfirmPassword ? "text" : "password"}
                placeholder={t("auth.resetPassword.confirmPasswordPlaceholder")}
                onChangeText={(txt) =>
                  setValue("confirmPassword", txt, { shouldValidate: true })
                }
                autoCapitalize="none"
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
            {errors.confirmPassword && (
              <FormControlError>
                <FormControlErrorIcon as={AlertCircle} />
                <FormControlErrorText>
                  {errors.confirmPassword.message}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
          {errorMessage && (
            <Text className="mt-2 text-center text-sm text-red-600">
              {errorMessage}
            </Text>
          )}
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
                <ButtonText>{t("auth.resetPassword.submit")}</ButtonText>
              </>
            ) : (
              <ButtonText>{t("auth.resetPassword.submit")}</ButtonText>
            )}
          </Button>
        </VStack>
      </Box>
    </ScrollView>
  );
}
