import { communityDetailById } from "@/api/endPoints/communities";
import { CommunityOptionsModal } from "@/components/communities/CommunityOptionsModal";
import { CreateClanModal } from "@/components/communities/CreateClanModal";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useClansByCommunity } from "@/hooks/queries/useClan";
import { useMessages } from "@/hooks/useMessages";
import authStore from "@/stores/auth.store";
import LanguageStore from "@/stores/language.store";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import {
  MessageCircle,
  MoreVertical,
  Paperclip,
  Plus,
  Search,
  Send,
  Shield,
  Users,
} from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CommunityDetailScreen() {
  const { id } = useLocalSearchParams();
  const language = LanguageStore.getState().language;
  const [inputMessage, setInputMessage] = useState("");
  const [activeTab, setActiveTab] = useState<
    "chat" | "quests" | "profile" | "clans" | "leaderboard"
  >("chat");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClan, setSelectedClan] = useState<string | null>(null);
  const [showCreateClanModal, setShowCreateClanModal] = useState(false);
  const [showCommunityOptions, setShowCommunityOptions] = useState(false);
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

  // Fetch clans from API
  const {
    data: clansData,
    isLoading: clansLoading,
    error: clansError,
  } = useClansByCommunity(id as string);

  const clans = clansData?.body?.data || [];
  const myClans = clans.filter((clan) => clan.isMember);
  const availableClans = clans.filter((clan) => !clan.isMember);

  const filteredClans = clans.filter((clan) =>
    clan.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                  <Shield size={12} color="#6b7280" />
                  <Text className="text-xs text-typography-500">
                    {community._count?.clans || 0} clans
                  </Text>
                </HStack>
              </VStack>
            </HStack>
            <Pressable
              className="p-2"
              onPress={() => setShowCommunityOptions(true)}
            >
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

                    // Format time in 12-hour format
                    const formatTime = (dateString: string) => {
                      const date = new Date(dateString);
                      return date.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      });
                    };

                    // Get first letter of username for avatar
                    const getInitial = (name?: string) => {
                      return name ? name.charAt(0).toUpperCase() : "?";
                    };

                    return (
                      <HStack
                        className={`px-4 py-2 ${
                          isMyMessage ? "justify-end" : "justify-start"
                        }`}
                        space="xs"
                      >
                        {/* Avatar for other users only */}
                        {!isMyMessage && (
                          <Box className="w-8 h-8 rounded-full bg-primary-500 items-center justify-center mt-1">
                            <Text className="text-white text-xs font-semibold">
                              {getInitial(item.UserName)}
                            </Text>
                          </Box>
                        )}

                        <Box
                          className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                            isMyMessage
                              ? "bg-gray-900 rounded-br-sm"
                              : "bg-gray-100 rounded-bl-sm"
                          }`}
                        >
                          <VStack space="xs">
                            {!isMyMessage && (
                              <Text className="text-xs font-semibold text-typography-700">
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
                              {formatTime(item.createdAt)}
                            </Text>
                          </VStack>
                        </Box>
                      </HStack>
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

          {activeTab === "clans" && (
            <VStack className="flex-1">
              {/* Header with Create Clan Button */}
              <HStack className="px-4 py-3 bg-background-50 items-center justify-between border-b border-outline-200">
                <Pressable
                  className="bg-primary-600 px-4 py-2 rounded-lg flex-row items-center gap-2"
                  onPress={() => setShowCreateClanModal(true)}
                >
                  <Plus size={16} color="#ffffff" />
                  <Text className="text-white text-sm font-semibold">
                    Create Clan
                  </Text>
                </Pressable>
              </HStack>

              {/* Search Bar */}
              <Box className="px-4 py-3 bg-background-0 border-b border-outline-200">
                <HStack
                  space="md"
                  className="bg-background-50 rounded-lg px-3 py-2 items-center border border-outline-200"
                >
                  <Search size={18} color="#9ca3af" />
                  <TextInput
                    placeholder="Search clans..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor="#9ca3af"
                    className="flex-1 text-typography-900 text-sm"
                  />
                </HStack>
              </Box>

              {/* Loading State */}
              {clansLoading ? (
                <Center className="flex-1">
                  <Spinner size="large" />
                  <Text className="mt-4 text-sm text-typography-500">
                    Loading clans...
                  </Text>
                </Center>
              ) : clansError ? (
                <Center className="flex-1 px-4">
                  <Text className="text-error-500 text-center">
                    Failed to load clans
                  </Text>
                </Center>
              ) : (
                /* Clans List */
                <FlatList
                  data={filteredClans}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={{ paddingBottom: 20 }}
                  ListHeaderComponent={
                    <>
                      {/* My Clans Section */}
                      {myClans.length > 0 && (
                        <VStack className="px-4 py-3">
                          <Text className="text-xs font-semibold text-typography-500 uppercase mb-2">
                            My Clans
                          </Text>
                        </VStack>
                      )}
                    </>
                  }
                  renderItem={({ item, index }) => {
                    const isMyClans = item.isMember;
                    const isSelected = selectedClan === item.id;
                    const showAvailableHeader =
                      index === myClans.length && availableClans.length > 0;

                    return (
                      <>
                        {showAvailableHeader && (
                          <VStack className="px-4 py-3 pt-4">
                            <Text className="text-xs font-semibold text-typography-500 uppercase mb-2">
                              Available Clans
                            </Text>
                          </VStack>
                        )}
                        <Pressable
                          onPress={() => setSelectedClan(item.id)}
                          className={`mx-4 mb-2 rounded-lg border ${
                            isSelected
                              ? "bg-primary-50 border-primary-500"
                              : "bg-background-0 border-outline-200"
                          }`}
                        >
                          <HStack space="md" className="px-4 py-3 items-center">
                            <Box
                              className={`w-12 h-12 rounded-lg items-center justify-center ${
                                isSelected ? "bg-primary-500" : "bg-primary-100"
                              }`}
                            >
                              <Text className="text-2xl">
                                {item.isPrivate ? "🔒" : "⚔️"}
                              </Text>
                            </Box>
                            <VStack className="flex-1">
                              <Text className="text-sm font-semibold text-typography-900">
                                {item.name}
                              </Text>
                              <HStack space="xs" className="items-center mt-1">
                                <Users size={12} color="#6b7280" />
                                <Text className="text-xs text-typography-500">
                                  {item.stats?.memberCount || 0} / {item.limit}{" "}
                                  members
                                </Text>
                              </HStack>
                            </VStack>
                            {isMyClans && (
                              <Box className="bg-primary-100 px-2 py-1 rounded">
                                <Text className="text-xs text-primary-700 font-medium">
                                  Joined
                                </Text>
                              </Box>
                            )}
                          </HStack>
                        </Pressable>
                      </>
                    );
                  }}
                  ListEmptyComponent={
                    <Center className="py-20">
                      <Shield size={48} color="#d1d5db" />
                      <Text className="mt-4 text-typography-500">
                        No clans found
                      </Text>
                    </Center>
                  }
                />
              )}
            </VStack>
          )}

          {activeTab !== "chat" && activeTab !== "clans" && (
            <Center className="flex-1">
              <Text className="text-typography-500 capitalize">
                {activeTab} for {community.name} coming soon
              </Text>
            </Center>
          )}
        </VStack>
      </KeyboardAvoidingView>

      {/* Create Clan Modal */}
      <CreateClanModal
        visible={showCreateClanModal}
        onClose={() => setShowCreateClanModal(false)}
        communityId={id as string}
      />

      {/* Community Options Modal */}
      <CommunityOptionsModal
        visible={showCommunityOptions}
        onClose={() => setShowCommunityOptions(false)}
        communityName={community?.name}
      />
    </SafeAreaView>
  );
}
