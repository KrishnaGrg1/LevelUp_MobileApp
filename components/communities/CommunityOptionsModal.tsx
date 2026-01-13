import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import {
  Bell,
  Info,
  LogOut,
  Settings,
  UserPlus,
  VolumeX,
} from "lucide-react-native";
import React from "react";
import { Modal, Pressable } from "react-native";

interface CommunityOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  communityName?: string;
}

export const CommunityOptionsModal: React.FC<CommunityOptionsModalProps> = ({
  visible,
  onClose,
  communityName,
}) => {
  const options = [
    { id: "info", label: "Community Info", icon: Info, color: "#6b7280" },
    { id: "settings", label: "Settings", icon: Settings, color: "#6b7280" },
    {
      id: "invite",
      label: "Invite Members",
      icon: UserPlus,
      color: "#6b7280",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      color: "#6b7280",
    },
    { id: "mute", label: "Mute", icon: VolumeX, color: "#6b7280" },
    { id: "leave", label: "Leave Community", icon: LogOut, color: "#ef4444" },
  ];

  const handleOptionPress = (optionId: string) => {
    // Handle option selection here
    console.log("Selected option:", optionId);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/50 justify-center items-center px-4"
        onPress={onClose}
      >
        <Pressable
          className="bg-white rounded-2xl w-full max-w-sm"
          onPress={(e) => e.stopPropagation()}
        >
          <VStack className="py-2">
            {options.map((option, index) => (
              <Pressable
                key={option.id}
                onPress={() => handleOptionPress(option.id)}
                className="px-4 py-3 active:bg-gray-50"
              >
                <HStack space="md" className="items-center">
                  <Box className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
                    <option.icon size={20} color={option.color} />
                  </Box>
                  <Text
                    className={`text-base ${
                      option.id === "leave"
                        ? "text-error-500 font-semibold"
                        : "text-typography-900"
                    }`}
                  >
                    {option.label}
                  </Text>
                </HStack>
              </Pressable>
            ))}
          </VStack>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
