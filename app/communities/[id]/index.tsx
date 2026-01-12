import { communityDetailById } from "@/api/endPoints/communities";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useMessages } from "@/hooks/useMessages";
import authStore from "@/stores/auth.store";
import LanguageStore from "@/stores/language.store";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import {
  MessageCircle,
  MoreVertical,
  Paperclip,
  Send,
  Users,
} from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  TextInput,
} from "react-native";

export default function CommunityDetailScreen() {
  const { id } = useLocalSearchParams();
  const language = LanguageStore.getState().language;
  const [inputMessage, setInputMessage] = useState("");
  const [activeTab, setActiveTab] = useState<
    "chat" | "quests" | "profile" | "clans" | "leaderboard"
  >("chat");
  const flatListRef = useRef<FlatList>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["community", id, language],
    queryFn: () => communityDetailById(language as any, id as string),
    enabled: !!id,
  });

  const {
    messages,
    sendMessage,
    isLoading: messagesLoading,
    isSending,
    loadMore,
    hasMore,
    accessDenied,
  } = useMessages({
    communityId: id as string,
    type: "community",
  });

  const community = data?.body?.data;

  const tabs = [
    { id: "chat", label: "Chat", icon: MessageCircle },
    { id: "quests", label: "Quests", icon: "🎯" },
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "clans", label: "Clans", icon: "⚔️" },
    { id: "leaderboard", label: "Leaderboard", icon: "🏆" },
  ] as const;

  if (isLoading) {
    return (
      <Center className="flex-1 bg-background-0">
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text className="mt-4 text-typography-500">Loading community...</Text>
      </Center>
    );
  }

  if (error || !community) {
    return (
      <Center className="flex-1 bg-background-0 p-4">
        <Text className="text-error-500 text-center">
          {error instanceof Error ? error.message : "Community not found"}
        </Text>
      </Center>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <VStack className="flex-1">
          {/* Top Navigation Tabs */}
          <HStack className="bg-background-50 border-b border-outline-200">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const renderIcon = () => {
                if (typeof tab.icon === "string") {
                  return <Text className="text-lg">{tab.icon}</Text>;
                }
                const Icon = tab.icon;
                return (
                  <Icon size={20} color={isActive ? "#8b5cf6" : "#6b7280"} />
                );
              };

              return (
                <Pressable
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex-1 items-center py-3 border-b-2 ${
                    isActive ? "border-primary-500" : "border-transparent"
                  }`}
                >
                  <VStack space="xs" className="items-center">
                    {renderIcon()}
                    <Text
                      className={`text-[10px] font-medium ${
                        isActive ? "text-primary-600" : "text-typography-500"
                      }`}
                    >
                      {tab.label}
                    </Text>
                  </VStack>
                </Pressable>
              );
            })}
          </HStack>

          {/* Community Header - Using Backend Data */}
          <HStack className="px-4 py-3 bg-background-0 border-b border-outline-200 items-center justify-between">
            <HStack space="md" className="items-center flex-1">
              <Box className="w-12 h-12 rounded-lg bg-primary-500 items-center justify-center">
                <Text className="text-2xl">{community.photo || "🛡️"}</Text>
              </Box>
              <VStack className="flex-1">
                <Heading
                  size="sm"
                  className="text-typography-900 leading-tight"
                >
                  {community.name}
                </Heading>
                <HStack space="xs" className="items-center">
                  <Users size={12} color="#6b7280" />
                  <Text className="text-xs text-typography-500">
                    {community._count?.members || 0} members
                  </Text>
                </HStack>
              </VStack>
            </HStack>
            <Pressable className="p-2">
              <MoreVertical size={20} color="#6b7280" />
            </Pressable>
          </HStack>

          {/* Content Area */}
          {activeTab === "chat" && (
            <>
              {accessDenied ? (
                <Center className="flex-1">
                  <VStack space="md" className="items-center px-8">
                    <Text className="text-error-500 text-lg font-semibold">
                      Access Denied
                    </Text>
                    <Text className="text-typography-500 text-center">
                      You don't have access to this community's chat.
                    </Text>
                  </VStack>
                </Center>
              ) : messagesLoading ? (
                <Center className="flex-1">
                  <Spinner size="large" />
                  <Text className="mt-4 text-sm text-typography-500">
                    Loading messages...
                  </Text>
                </Center>
              ) : messages.length === 0 ? (
                <Center className="flex-1 bg-background-0">
                  <VStack space="lg" className="items-center px-8">
                    <Box className="w-20 h-20 rounded-full bg-background-100 items-center justify-center">
                      <MessageCircle
                        size={40}
                        color="#9ca3af"
                        strokeWidth={1.5}
                      />
                    </Box>
                    <VStack space="xs" className="items-center">
                      <Heading
                        size="xl"
                        className="text-typography-900 text-center"
                      >
                        No messages yet
                      </Heading>
                      <Text className="text-center text-typography-500">
                        Welcome to {community.name}! Be the first to start the
                        conversation.
                      </Text>
                    </VStack>
                  </VStack>
                </Center>
              ) : (
                <FlatList
                  ref={flatListRef}
                  data={messages}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => {
                    const currentUser = authStore.getState().user;
                    const isMyMessage =
                      currentUser?.UserName &&
                      item.UserName &&
                      currentUser.UserName === item.UserName;

                    return (
                      <Box
                        className={`px-4 py-2 ${
                          isMyMessage ? "items-end" : "items-start"
                        }`}
                      >
                        <Box
                          className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                            isMyMessage
                              ? "bg-gray-900 rounded-br-sm"
                              : "bg-gray-100 rounded-bl-sm"
                          }`}
                        >
                          <VStack space="xs">
                            {!isMyMessage && (
                              <Text
                                className={`text-xs font-semibold ${
                                  isMyMessage
                                    ? "text-white"
                                    : "text-typography-700"
                                }`}
                              >
                                {item.UserName || "Anonymous"}
                              </Text>
                            )}
                            <Text
                              className={`text-sm ${
                                isMyMessage
                                  ? "text-white"
                                  : "text-typography-900"
                              }`}
                            >
                              {item.content}
                            </Text>
                            <Text
                              className={`text-xs ${
                                isMyMessage
                                  ? "text-gray-300"
                                  : "text-typography-400"
                              }`}
                            >
                              {new Date(item.createdAt).toLocaleTimeString()}
                            </Text>
                          </VStack>
                        </Box>
                      </Box>
                    );
                  }}
                  onEndReached={hasMore ? loadMore : undefined}
                  onEndReachedThreshold={0.5}
                  className="flex-1 bg-background-0"
                />
              )}

              <HStack
                space="md"
                className="px-4 py-3 bg-background-0 border-t border-outline-200 items-center"
              >
                <Pressable className="p-2">
                  <Paperclip size={22} color="#6b7280" />
                </Pressable>
                <Box className="flex-1 bg-background-50 rounded-2xl px-4 py-1 border border-outline-200">
                  <TextInput
                    placeholder="Type a message..."
                    value={inputMessage}
                    onChangeText={setInputMessage}
                    placeholderTextColor="#9ca3af"
                    className="text-typography-900 text-sm min-h-[40px]"
                    multiline
                    editable={!isSending}
                  />
                </Box>
                <Pressable
                  onPress={() => {
                    if (inputMessage.trim()) {
                      sendMessage(inputMessage);
                      setInputMessage("");
                    }
                  }}
                  disabled={isSending || !inputMessage.trim()}
                  className={`w-10 h-10 rounded-full items-center justify-center ${
                    isSending || !inputMessage.trim()
                      ? "bg-typography-300"
                      : "bg-primary-600"
                  }`}
                >
                  {isSending ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Send size={18} color="#ffffff" />
                  )}
                </Pressable>
              </HStack>
            </>
          )}

          {activeTab !== "chat" && (
            <Center className="flex-1">
              <Text className="text-typography-500 capitalize">
                {activeTab} for {community.name} coming soon
              </Text>
            </Center>
          )}
        </VStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
