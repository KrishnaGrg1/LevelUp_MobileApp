import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";

import { Box } from "@/components/ui/box";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { useForgetPassword } from "@/hooks/useAuth";
import {
  ForgetPasswordInput,
  ForgetPasswordSchema,
} from "@/schemas/auth/forgetPassword";
import { useTranslation } from "@/translation";
import { Link, useRouter } from "expo-router";
import { AlertCircle, Mail } from "lucide-react-native";

export default function ForgetPasswordScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { mutate: forgetPassword, isPending } = useForgetPassword();

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ForgetPasswordInput>({
    resolver: zodResolver(ForgetPasswordSchema),
  });

  const onSubmit = (data: ForgetPasswordInput) => {
    forgetPassword(data);
  };

  return (
    <ScrollView className="flex-1 bg-background-0">
      <Box className="flex-1 px-6 py-8">
        {/* Icon */}
        <Center className="mb-6">
          <Box className="h-16 w-16 items-center justify-center rounded-full bg-background-50 border-2 border-outline-200">
            <Icon as={Mail} size="xl" className="text-typography-900" />
          </Box>
        </Center>

        {/* Title */}
        <Heading size="2xl" className="mb-2 text-center text-typography-900">
          {t("auth.forgetPassword.title")}
        </Heading>

        {/* Subtitle */}
        <Text className="mb-8 text-center text-typography-500">
          {t("auth.forgetPassword.subtitle")}
        </Text>

        <VStack space="lg" className="mb-6">
          {/* Email Field */}
          <FormControl isInvalid={!!errors.email} isRequired>
            <FormControlLabel>
              <FormControlLabelText className="text-typography-900">
                {t("auth.forgetPassword.email")}
              </FormControlLabelText>
            </FormControlLabel>
            <Input
              className="border-outline-300"
              size="lg"
              isInvalid={!!errors.email}
            >
              <InputField
                type="text"
                placeholder={t("auth.forgetPassword.emailPlaceholder")}
                onChangeText={(txt) =>
                  setValue("email", txt, { shouldValidate: true })
                }
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </Input>
            {!errors.email && (
              <FormControlHelper>
                <FormControlHelperText>
                  We'll send a reset code to this email
                </FormControlHelperText>
              </FormControlHelper>
            )}
            {errors.email && (
              <FormControlError>
                <FormControlErrorIcon as={AlertCircle} />
                <FormControlErrorText>
                  {errors.email.message}
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
                <ButtonText>{t("auth.forgetPassword.submit")}</ButtonText>
              </>
            ) : (
              <ButtonText>{t("auth.forgetPassword.submit")}</ButtonText>
            )}
          </Button>

          {/* Back to Login */}
          <Center className="mt-4">
            <Link href="/(auth)/login" asChild>
              <Pressable>
                <Text className="text-center text-sm text-typography-500">
                  Remember your password?{" "}
                  <Text className="font-medium text-typography-900 underline">
                    Log in
                  </Text>
                </Text>
              </Pressable>
            </Link>
          </Center>
        </VStack>
      </Box>
    </ScrollView>
  );
}
