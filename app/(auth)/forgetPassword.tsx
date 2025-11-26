import React from "react";

import { ForgetPasswordForm } from "@/components/auth/ForgetPasswordForm";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";

import { useTranslation } from "@/translation";
import { Mail } from "lucide-react-native";

export default function ForgetPasswordScreen() {
  const { t } = useTranslation();

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

        {/* Forget Password Form */}
        <ForgetPasswordForm />
      </Box>
    </ScrollView>
  );
}
