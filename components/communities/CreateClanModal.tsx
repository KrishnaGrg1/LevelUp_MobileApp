import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useCreateClan } from "@/hooks/queries/useClan";
import { X } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Switch,
  TextInput,
} from "react-native";

interface CreateClanModalProps {
  visible: boolean;
  onClose: () => void;
  communityId: string;
}

export const CreateClanModal: React.FC<CreateClanModalProps> = ({
  visible,
  onClose,
  communityId,
}) => {
  const [clanName, setClanName] = useState("");
  const [description, setDescription] = useState("");
  const [memberLimit, setMemberLimit] = useState("50");
  const [isPrivate, setIsPrivate] = useState(false);

  const createClanMutation = useCreateClan();

  const handleCreate = async () => {
    if (!clanName.trim()) {
      Alert.alert("Error", "Please enter a clan name");
      return;
    }

    const limit = parseInt(memberLimit);
    if (isNaN(limit) || limit < 1) {
      Alert.alert("Error", "Please enter a valid member limit");
      return;
    }

    try {
      await createClanMutation.mutateAsync({
        name: clanName.trim(),
        communityId,
        description: description.trim() || undefined,
        isPrivate,
        limit,
      });

      Alert.alert("Success", "Clan created successfully!");
      handleClose();
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to create clan"
      );
    }
  };

  const handleClose = () => {
    setClanName("");
    setDescription("");
    setMemberLimit("50");
    setIsPrivate(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={handleClose}
    >
      <Pressable
        className="flex-1 bg-black/50 justify-center items-center px-4"
        onPress={handleClose}
      >
        <Pressable
          className="bg-white rounded-2xl w-full max-w-md"
          onPress={(e) => e.stopPropagation()}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <VStack className="p-6" space="lg">
              {/* Header */}
              <HStack className="justify-between items-center">
                <VStack space="xs">
                  <Heading size="lg" className="text-typography-900">
                    Create New Clan
                  </Heading>
                  <Text className="text-sm text-typography-500">
                    Create a new clan within this community. Fill in the details
                    below.
                  </Text>
                </VStack>
                <Pressable onPress={handleClose} className="p-2 -mr-2">
                  <X size={24} color="#6b7280" />
                </Pressable>
              </HStack>

              {/* Clan Name */}
              <VStack space="xs">
                <Text className="text-sm font-medium text-typography-900">
                  Clan Name <Text className="text-error-500">*</Text>
                </Text>
                <Box className="border border-outline-200 rounded-lg bg-background-0">
                  <TextInput
                    placeholder="Enter clan name"
                    value={clanName}
                    onChangeText={setClanName}
                    placeholderTextColor="#9ca3af"
                    className="px-4 py-3 text-typography-900"
                  />
                </Box>
              </VStack>

              {/* Description */}
              <VStack space="xs">
                <Text className="text-sm font-medium text-typography-900">
                  Description
                </Text>
                <Box className="border border-outline-200 rounded-lg bg-background-0">
                  <TextInput
                    placeholder="Describe your clan..."
                    value={description}
                    onChangeText={setDescription}
                    placeholderTextColor="#9ca3af"
                    className="px-4 py-3 text-typography-900"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </Box>
              </VStack>

              {/* Member Limit */}
              <VStack space="xs">
                <Text className="text-sm font-medium text-typography-900">
                  Member Limit
                </Text>
                <Box className="border border-outline-200 rounded-lg bg-background-0">
                  <TextInput
                    placeholder="50"
                    value={memberLimit}
                    onChangeText={setMemberLimit}
                    placeholderTextColor="#9ca3af"
                    className="px-4 py-3 text-typography-900"
                    keyboardType="number-pad"
                  />
                </Box>
              </VStack>

              {/* Private Clan Toggle */}
              <HStack className="justify-between items-center py-2">
                <VStack className="flex-1">
                  <Text className="text-sm font-medium text-typography-900">
                    Private Clan
                  </Text>
                  <Text className="text-xs text-typography-500 mt-1">
                    Only invited members can join
                  </Text>
                </VStack>
                <Switch
                  value={isPrivate}
                  onValueChange={setIsPrivate}
                  trackColor={{ false: "#d1d5db", true: "#8b5cf6" }}
                  thumbColor="#ffffff"
                />
              </HStack>

              {/* Action Buttons */}
              <HStack space="md" className="mt-2">
                <Button
                  onPress={handleClose}
                  variant="outline"
                  className="flex-1 border-outline-300"
                  disabled={createClanMutation.isPending}
                >
                  <ButtonText className="text-typography-700">
                    Cancel
                  </ButtonText>
                </Button>
                <Button
                  onPress={handleCreate}
                  className="flex-1 bg-primary-600"
                  disabled={createClanMutation.isPending}
                >
                  <ButtonText className="text-white">
                    {createClanMutation.isPending
                      ? "Creating..."
                      : "Create Clan"}
                  </ButtonText>
                </Button>
              </HStack>
            </VStack>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
