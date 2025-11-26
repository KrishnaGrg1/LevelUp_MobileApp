import React from "react";

import { LoginForm } from "@/components/auth/LoginForm";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";

import { useTranslation } from "@/translation";
import { router } from "expo-router";
import { Sparkles } from "lucide-react-native";

export default function LoginScreen() {
  const { t } = useTranslation();

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
          {t("auth.login.title")}
        </Heading>

        {/* Subtitle */}
        <Text className="mb-8 text-center text-typography-500">
          {t("auth.login.noAccount")}{" "}
          <Text
            onPress={() => router.replace("/(auth)/register")}
            className="font-medium text-typography-900 underline"
          >
            {t("auth.login.registerLink")}
          </Text>
        </Text>

        {/* Login Form */}
        <LoginForm />

        {process.env.NODE_ENV === "development" && (
          <Button onPress={() => router.push("/_sitemap")}>
            <ButtonText>Go to main layout</ButtonText>
          </Button>
        )}
      </Box>
    </ScrollView>
  );
}
