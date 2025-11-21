import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { useThemeStore } from "@/stores/theme.store";
import { useTranslation } from "@/translation";
import { Monitor, Moon, Sun } from "lucide-react-native";
import React from "react";
export function ModeToggle() {
  const { theme, setTheme } = useThemeStore();
  const { t } = useTranslation();
  const options = [
    { value: "system" as const, label: "settings.themeAuto", icon: Monitor },
    { value: "light" as const, label: "", icon: Sun },
    { value: "dark" as const, label: "", icon: Moon },
  ];

  return (
    <HStack className="rounded-full bg-background-50 p-1">
      {options.map((option) => {
        const isActive = theme === option.value;
        return (
          <Pressable
            key={option.value}
            onPress={() => setTheme(option.value)}
            className={`flex-1 items-center justify-center rounded-full px-6 py-3 ${
              isActive ? "bg-primary-500" : "bg-transparent"
            }`}
          >
            {option.label ? (
              <Text
                size="md"
                className={`font-medium ${
                  isActive ? "text-white" : "text-typography-900"
                }`}
              >
                {t(option.label)}
              </Text>
            ) : (
              <Icon
                as={option.icon}
                size="lg"
                className={isActive ? "text-white" : "text-typography-900"}
              />
            )}
          </Pressable>
        );
      })}
    </HStack>
  );
}
