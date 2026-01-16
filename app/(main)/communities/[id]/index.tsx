import { communityDetailById } from '@/api/endPoints/communities';
import { ClansTab } from '@/components/communities/ClansTab';
import { CommunityOptionsModal } from '@/components/communities/CommunityOptionsModal';
import { InviteMembersModal } from '@/components/communities/InviteMembersModal';
import { ProfileTab } from '@/components/communities/ProfileTab';
import { TransferOwnershipModal } from '@/components/communities/TransferOwnershipModal';
import { Box } from '@/components/ui/box';
import { Center } from '@/components/ui/center';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

import { useMessages } from '@/hooks/useMessages';
import authStore from '@/stores/auth.store';
import LanguageStore from '@/stores/language.store';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { MessageCircle, MoreVertical, Paperclip, Send, Shield, Users } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CommunityDetailScreen() {
  const { id } = useLocalSearchParams();
  const language = LanguageStore.getState().language;
  const [inputMessage, setInputMessage] = useState('');
  const [activeTab, setActiveTab] = useState<
    'chat' | 'quests' | 'profile' | 'clans' | 'leaderboard'
  >('chat');
  const [showCommunityOptions, setShowCommunityOptions] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const authSession = authStore.getState().authSession as string;
  const currentUserId = authStore.getState().user?.id;
  const { data, isLoading, error } = useQuery({
    queryKey: ['community', id, language],
    queryFn: () => communityDetailById(language as any, id as string, authSession),
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
    type: 'community',
  });

  const community = data?.body?.data;

  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'quests', label: 'Quests', icon: '🎯' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'clans', label: 'Clans', icon: '⚔️' },
    { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
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
        <Text className="text-center text-error-500">
          {error instanceof Error ? error.message : 'Community not found'}
        </Text>
      </Center>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <VStack className="flex-1">
          {/* Top Navigation Tabs */}
          <HStack className="border-b border-outline-200 bg-background-50">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              const renderIcon = () => {
                if (typeof tab.icon === 'string') {
                  return <Text className="text-lg">{tab.icon}</Text>;
                }
                const Icon = tab.icon;
                return <Icon size={20} color={isActive ? '#8b5cf6' : '#6b7280'} />;
              };

              return (
                <Pressable
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex-1 items-center border-b-2 py-3 ${
                    isActive ? 'border-primary-500' : 'border-transparent'
                  }`}
                >
                  <VStack space="xs" className="items-center">
                    {renderIcon()}
                    <Text
                      className={`text-[10px] font-medium ${
                        isActive ? 'text-primary-600' : 'text-typography-500'
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
          <HStack className="items-center justify-between border-b border-outline-200 bg-background-0 px-4 py-3">
            <HStack space="md" className="flex-1 items-center">
              {community.photo ? (
                <Box className="h-12 w-12 overflow-hidden rounded-lg bg-primary-500">
                  <Image
                    source={{ uri: community.photo }}
                    style={{ width: 48, height: 48 }}
                    resizeMode="cover"
                  />
                </Box>
              ) : (
                <Box className="h-12 w-12 items-center justify-center rounded-lg bg-primary-500">
                  <Text className="text-2xl">🛡️</Text>
                </Box>
              )}
              <VStack className="flex-1">
                <Heading size="sm" className="leading-tight text-typography-900">
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
            <Pressable className="p-2" onPress={() => setShowCommunityOptions(true)}>
              <MoreVertical size={20} color="#6b7280" />
            </Pressable>
          </HStack>

          {/* Content Area */}
          {activeTab === 'chat' && (
            <>
              {accessDenied ? (
                <Center className="flex-1">
                  <VStack space="md" className="items-center px-8">
                    <Text className="text-lg font-semibold text-error-500">Access Denied</Text>
                    <Text className="text-center text-typography-500">
                      You don't have access to this community's chat.
                    </Text>
                  </VStack>
                </Center>
              ) : messagesLoading ? (
                <Center className="flex-1">
                  <Spinner size="large" />
                  <Text className="mt-4 text-sm text-typography-500">Loading messages...</Text>
                </Center>
              ) : messages.length === 0 ? (
                <Center className="flex-1 bg-background-0">
                  <VStack space="lg" className="items-center px-8">
                    <Box className="h-20 w-20 items-center justify-center rounded-full bg-background-100">
                      <MessageCircle size={40} color="#9ca3af" strokeWidth={1.5} />
                    </Box>
                    <VStack space="xs" className="items-center">
                      <Heading size="xl" className="text-center text-typography-900">
                        No messages yet
                      </Heading>
                      <Text className="text-center text-typography-500">
                        Welcome to {community.name}! Be the first to start the conversation.
                      </Text>
                    </VStack>
                  </VStack>
                </Center>
              ) : (
                <FlatList
                  ref={flatListRef}
                  data={messages}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => {
                    const currentUser = authStore.getState().user;
                    const isMyMessage =
                      currentUser?.UserName &&
                      item.UserName &&
                      currentUser.UserName === item.UserName;

                    // Format time in 12-hour format
                    const formatTime = (dateString: string) => {
                      const date = new Date(dateString);
                      return date.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      });
                    };

                    // Get first letter of username for avatar
                    const getInitial = (name?: string) => {
                      return name ? name.charAt(0).toUpperCase() : '?';
                    };

                    return (
                      <HStack
                        className={`px-4 py-2 ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                        space="xs"
                      >
                        {/* Avatar for other users only */}
                        {!isMyMessage && (
                          <Box className="mt-1 h-8 w-8 items-center justify-center rounded-full bg-primary-500">
                            <Text className="text-xs font-semibold text-white">
                              {getInitial(item.UserName)}
                            </Text>
                          </Box>
                        )}

                        <Box
                          className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                            isMyMessage ? 'rounded-br-sm bg-gray-900' : 'rounded-bl-sm bg-gray-100'
                          }`}
                        >
                          <VStack space="xs">
                            {!isMyMessage && (
                              <Text className="text-xs font-semibold text-typography-700">
                                {item.UserName || 'Anonymous'}
                              </Text>
                            )}
                            <Text
                              className={`text-sm ${
                                isMyMessage ? 'text-white' : 'text-typography-900'
                              }`}
                            >
                              {item.content}
                            </Text>
                            <Text
                              className={`text-xs ${
                                isMyMessage ? 'text-gray-300' : 'text-typography-400'
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
                className="items-center border-t border-outline-200 bg-background-0 px-4 py-3"
              >
                <Pressable className="p-2">
                  <Paperclip size={22} color="#6b7280" />
                </Pressable>
                <Box className="flex-1 rounded-2xl border border-outline-200 bg-background-50 px-4 py-1">
                  <TextInput
                    placeholder="Type a message..."
                    value={inputMessage}
                    onChangeText={setInputMessage}
                    placeholderTextColor="#9ca3af"
                    className="min-h-[40px] text-sm text-typography-900"
                    multiline
                    editable={!isSending}
                  />
                </Box>
                <Pressable
                  onPress={() => {
                    if (inputMessage.trim()) {
                      sendMessage(inputMessage);
                      setInputMessage('');
                    }
                  }}
                  disabled={isSending || !inputMessage.trim()}
                  className={`h-10 w-10 items-center justify-center rounded-full ${
                    isSending || !inputMessage.trim() ? 'bg-typography-300' : 'bg-primary-600'
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

          {activeTab === 'clans' && (
            <ClansTab communityId={id as string} communityName={community?.name} />
          )}

          {activeTab === 'profile' && (
            <ProfileTab community={community} onViewAllClans={() => setActiveTab('clans')} />
          )}

          {activeTab !== 'chat' && activeTab !== 'clans' && activeTab !== 'profile' && (
            <Center className="flex-1">
              <Text className="capitalize text-typography-500">
                {activeTab} for {community.name} coming soon
              </Text>
            </Center>
          )}
        </VStack>
      </KeyboardAvoidingView>

      {/* Community Options Modal */}
      <CommunityOptionsModal
        visible={showCommunityOptions}
        onClose={() => setShowCommunityOptions(false)}
        onTransferOwnership={() => {
          setShowCommunityOptions(false);
          setShowTransferModal(true);
        }}
        onInviteMembers={() => setShowInviteModal(true)}
        onCommunityInfo={() => setActiveTab('profile')}
        isOwner={community?.ownerId === currentUserId}
        communityName={community?.name}
        communityId={id as string}
      />

      {/* Invite Members Modal */}
      <InviteMembersModal
        visible={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        communityId={id as string}
        communityName={community?.name}
        isOwner={community?.ownerId === currentUserId}
      />

      {/* Transfer Ownership Modal */}
      <TransferOwnershipModal
        visible={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        communityId={id as string}
        communityName={community?.name}
      />
    </SafeAreaView>
  );
}
