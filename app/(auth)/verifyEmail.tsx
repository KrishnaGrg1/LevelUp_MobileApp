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
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import { useVerifyEmail } from "@/hooks/useAuth";
import { VerifyInput, VerifySchema } from "@/schemas/auth/verifyEmail";
import authStore from "@/stores/auth.store";
import { useTranslation } from "@/translation";
import { useRouter } from "expo-router";
import { AlertCircle, ArrowLeft, ShieldCheck } from "lucide-react-native";

export default function VerifyEmailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { mutate: verifyEmail, isPending } = useVerifyEmail();
  const userId = authStore.getState().user?.id;

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VerifyInput>({
    resolver: zodResolver(VerifySchema),
    defaultValues: {
      userId: userId || "",
      otp: "",
    },
  });

  const onSubmit = (data: VerifyInput) => {
    verifyEmail({ ...data, userId: userId || data.userId });
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
            <Icon as={ShieldCheck} size="xl" className="text-typography-900" />
          </Box>
        </Center>

        {/* Title */}
        <Heading size="2xl" className="mb-2 text-center text-typography-900">
          {t("auth.verify.title")}
        </Heading>

        {/* Subtitle */}
        <Text className="mb-8 text-center text-typography-500">
          {t("auth.verify.subtitle")}
        </Text>

        <VStack space="lg" className="mb-6">
          {/* OTP Field */}
          <FormControl isInvalid={!!errors.otp} isRequired>
            <FormControlLabel>
              <FormControlLabelText className="text-typography-900">
                {t("auth.verify.otp")}
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
                textAlign="center"
                className="text-2xl font-semibold tracking-widest"
              />
            </Input>
            {!errors.otp && (
              <FormControlHelper>
                <FormControlHelperText>
                  Enter the 6-digit code sent to your email
                </FormControlHelperText>
              </FormControlHelper>
            )}
            {errors.otp && (
              <FormControlError>
                <FormControlErrorIcon as={AlertCircle} />
                <FormControlErrorText>
                  {errors.otp.message}
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
                <ButtonText>{t("auth.verify.submit")}</ButtonText>
              </>
            ) : (
              <ButtonText>{t("auth.verify.submit")}</ButtonText>
            )}
          </Button>

          {/* Resend Code */}
          <Center className="mt-4">
            <Pressable>
              <Text className="text-center text-sm text-typography-500">
                Didn't receive the code?{" "}
                <Text className="font-medium text-typography-900 underline">
                  Resend
                </Text>
              </Text>
            </Pressable>
          </Center>
        </VStack>
      </Box>
    </ScrollView>
  );
}
