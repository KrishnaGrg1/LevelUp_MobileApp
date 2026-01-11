import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { AlertCircle, X } from "lucide-react-native";
import React from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable } from "react-native";

interface JoinPrivateCommunityModalProps {
  visible: boolean;
  onClose: () => void;
}

export function JoinPrivateCommunityModal({
  visible,
  onClose,
}: JoinPrivateCommunityModalProps) {
  const [inviteCode, setInviteCode] = React.useState("");

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <Box className="flex-1 bg-white">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <VStack className="flex-1">
            {/* Header */}
            <HStack className="px-6 pt-12 pb-4 justify-between items-center border-b border-outline-200">
              <Heading size="2xl" className="text-typography-900">
                Join Private Community
              </Heading>
              <Pressable onPress={onClose}>
                <X size={24} color="#374151" />
              </Pressable>
            </HStack>

            {/* Content */}
            <VStack className="flex-1 px-6 mt-8" space="lg">
              {/* Info Banner */}
              <HStack
                space="sm"
                className="p-4 bg-blue-50 rounded-lg border border-blue-200"
              >
                <AlertCircle size={20} color="#3b82f6" />
                <VStack className="flex-1">
                  <Text className="text-sm font-semibold text-blue-900">
                    Invitation Code Required
                  </Text>
                  <Text className="text-xs text-blue-700 mt-1">
                    Private communities require an invitation code from an admin
                    or member
                  </Text>
                </VStack>
              </HStack>

              {/* Invite Code Input */}
              <VStack space="xs">
                <Text className="text-sm font-medium text-typography-700">
                  Invite Code <Text className="text-error-500">*</Text>
                </Text>
                <Input
                  variant="outline"
                  size="lg"
                  className="border-outline-300"
                >
                  <InputField
                    placeholder="Enter 6-digit code"
                    value={inviteCode}
                    onChangeText={setInviteCode}
                    placeholderTextColor="#9ca3af"
                    maxLength={6}
                    autoCapitalize="characters"
                  />
                </Input>
                <Text className="text-xs text-typography-500">
                  Example: ABC123
                </Text>
              </VStack>
            </VStack>

            {/* Footer Buttons */}
            <HStack
              space="md"
              className="px-6 pb-8 pt-4 border-t border-outline-200"
            >
              <Button
                size="lg"
                variant="outline"
                onPress={onClose}
                className="flex-1 border-outline-300"
              >
                <ButtonText className="text-typography-700">Cancel</ButtonText>
              </Button>
              <Button
                size="lg"
                className="flex-1 bg-primary-500"
                onPress={() => {
                  // Handle join with code
                  console.log("Join with code:", inviteCode);
                }}
              >
                <ButtonText>Join Community</ButtonText>
              </Button>
            </HStack>
          </VStack>
        </KeyboardAvoidingView>
      </Box>
    </Modal>
  );
}
