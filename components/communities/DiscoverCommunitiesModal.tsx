import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Key, Search, X } from "lucide-react-native";
import React from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable } from "react-native";

interface DiscoverCommunitiesModalProps {
  visible: boolean;
  onClose: () => void;
  onJoinPrivate: () => void;
}

export function DiscoverCommunitiesModal({
  visible,
  onClose,
  onJoinPrivate,
}: DiscoverCommunitiesModalProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<"search" | "private">(
    "search"
  );

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
              <VStack space="xs" className="flex-1">
                <Heading size="2xl" className="text-typography-900">
                  Discover Communities
                </Heading>
                <Text className="text-sm text-typography-500">
                  Search and join communities that match your interests
                </Text>
              </VStack>
              <Pressable onPress={onClose}>
                <X size={24} color="#374151" />
              </Pressable>
            </HStack>

            {/* Tabs */}
            <HStack space="sm" className="px-6 mt-4">
              <Pressable
                onPress={() => setActiveTab("search")}
                className={`flex-1 py-3 rounded-lg items-center justify-center ${
                  activeTab === "search" ? "bg-primary-500" : "bg-background-50"
                }`}
              >
                <HStack space="xs" className="items-center">
                  <Search
                    size={18}
                    color={activeTab === "search" ? "#ffffff" : "#6b7280"}
                  />
                  <Text
                    className={`text-sm font-semibold ${
                      activeTab === "search"
                        ? "text-white"
                        : "text-typography-600"
                    }`}
                  >
                    Search Communities
                  </Text>
                </HStack>
              </Pressable>

              <Pressable
                onPress={() => {
                  setActiveTab("private");
                  onJoinPrivate();
                }}
                className={`flex-1 py-3 rounded-lg items-center justify-center ${
                  activeTab === "private"
                    ? "bg-primary-500"
                    : "bg-background-50"
                }`}
              >
                <HStack space="xs" className="items-center">
                  <Key
                    size={18}
                    color={activeTab === "private" ? "#ffffff" : "#6b7280"}
                  />
                  <Text
                    className={`text-sm font-semibold ${
                      activeTab === "private"
                        ? "text-white"
                        : "text-typography-600"
                    }`}
                  >
                    Join Private Community
                  </Text>
                </HStack>
              </Pressable>
            </HStack>

            {/* Search Input */}
            {activeTab === "search" && (
              <VStack className="flex-1 px-6 mt-6">
                <Input
                  variant="outline"
                  size="lg"
                  className="border-outline-300"
                >
                  <InputSlot className="pl-3">
                    <InputIcon as={Search} className="text-typography-400" />
                  </InputSlot>
                  <InputField
                    placeholder="Search communities..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor="#9ca3af"
                  />
                </Input>

                {/* Empty State */}
                <Center className="flex-1">
                  <VStack space="md" className="items-center max-w-xs">
                    <Box className="w-24 h-24 rounded-full bg-background-100 items-center justify-center">
                      <Search size={48} color="#9ca3af" strokeWidth={1.5} />
                    </Box>
                    <Text className="text-center text-typography-600">
                      Start typing to search for communities
                    </Text>
                  </VStack>
                </Center>
              </VStack>
            )}
          </VStack>
        </KeyboardAvoidingView>
      </Box>
    </Modal>
  );
}
