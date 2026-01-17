import React, { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { MessageCircle, MoreVertical, Paperclip, Send, Shield, Users } from 'lucide-react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  completeQuest,
  fetchDailyQuests,
  fetchWeeklyQuests,
  Quest,
  startQuest,
} from '@/api/endPoints/ai';
import { communityDetailById } from '@/api/endPoints/communities';
import { getCommunityLeaderboard, getTopClans } from '@/api/endPoints/leaderboard';
import { ClansTab } from '@/components/communities/ClansTab';
import { CommunityOptionsModal } from '@/components/communities/CommunityOptionsModal';
import { InviteMembersModal } from '@/components/communities/InviteMembersModal';
import { ProfileTab } from '@/components/communities/ProfileTab';
import { TransferOwnershipModal } from '@/components/communities/TransferOwnershipModal';
import { Box } from '@/components/ui/box';
import { Center } from '@/components/ui/center';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { ScrollView } from '@/components/ui/scroll-view';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useMessages } from '@/hooks/useMessages';
import authStore from '@/stores/auth.store';
import LanguageStore from '@/stores/language.store';

export default function CommunityDetailScreen() {
  const { id } = useLocalSearchParams();
  const communityId = Array.isArray(id) ? id[0] : id;
  const language = LanguageStore.getState().language;
  const [inputMessage, setInputMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'quests' | 'profile' | 'clans' | 'leaderboard'>(
    'chat',
  );
  const [activeQuestTab, setActiveQuestTab] = useState<'daily' | 'weekly'>('daily');
  const [activeCommunityLeaderboard, setActiveCommunityLeaderboard] =
    useState<'members' | 'clans'>('members');
  const [showCommunityOptions, setShowCommunityOptions] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const authSession = authStore.getState().authSession as string;
  const currentUserId = authStore.getState().user?.id;
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['community', communityId, language],
    queryFn: () => communityDetailById(language as any, communityId as string, authSession),
    enabled: !!communityId,
  });

  const {
    data: dailyQuestsData,
    isLoading: isLoadingDaily,
    error: dailyError,
  } = useQuery({
    queryKey: ['daily-quests', communityId, currentUserId, language],
    queryFn: () => fetchDailyQuests(language as any, authSession),
    enabled: !!communityId && !!authSession && !!currentUserId,
  });

  const {
    data: weeklyQuestsData,
    isLoading: isLoadingWeekly,
    error: weeklyError,
  } = useQuery({
    queryKey: ['weekly-quests', communityId, currentUserId, language],
    queryFn: () => fetchWeeklyQuests(language as any, authSession),
    enabled: !!communityId && !!authSession && !!currentUserId,
  });

  const todaysCommunityQuests = useMemo<Quest[]>(() => {
    const quests = dailyQuestsData?.body?.data?.today || [];
    if (!communityId || !currentUserId) return [];
    return quests.filter(q => q.communityId === communityId && q.userId === currentUserId);
  }, [dailyQuestsData?.body?.data?.today, communityId, currentUserId]);

  const thisWeekCommunityQuests = useMemo<Quest[]>(() => {
    const quests = weeklyQuestsData?.body?.data?.thisWeek || [];
    if (!communityId || !currentUserId) return [];
    return quests.filter(q => q.communityId === communityId && q.userId === currentUserId);
  }, [weeklyQuestsData?.body?.data?.thisWeek, communityId, currentUserId]);

  const [actionLoading, setActionLoading] = useState<Record<string, 'start' | 'complete' | null>>(
    {},
  );

  const setLoadingState = (questId: string, state: 'start' | 'complete' | null) => {
    setActionLoading(prev => ({ ...prev, [questId]: state }));
  };

  const startQuestMutation = useMutation({
    mutationFn: (questId: string) => startQuest(questId, language as any, authSession),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['daily-quests', communityId, currentUserId, language],
      });
      queryClient.invalidateQueries({
        queryKey: ['weekly-quests', communityId, currentUserId, language],
      });
    },
    onSettled: (_data, _error, questId) => setLoadingState(questId, null),
  });

  const completeQuestMutation = useMutation({
    mutationFn: (questId: string) => completeQuest(questId, language as any, authSession),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['daily-quests', communityId, currentUserId, language],
      });
      queryClient.invalidateQueries({
        queryKey: ['weekly-quests', communityId, currentUserId, language],
      });
    },
    onSettled: (_data, _error, questId) => setLoadingState(questId, null),
  });

  const getTimerState = (quest: Quest) => {
    const estimated = quest.estimatedMinutes ?? 30;
    if (!quest.startedAt) {
      return {
        isReady: false,
        remainingMinutes: estimated,
        label: `Est. ${estimated} min required`,
      };
    }

    const startMs = new Date(quest.startedAt).getTime();
    const endMs = startMs + estimated * 60 * 1000;
    const nowMs = Date.now();
    const remainingMs = endMs - nowMs;
    const remainingMinutes = Math.max(0, Math.ceil(remainingMs / (60 * 1000)));

    return {
      isReady: remainingMs <= 0,
      remainingMinutes,
      label: remainingMs <= 0 ? 'Ready to complete' : `Ready in ${remainingMinutes} min`,
    };
  };

  const {
    messages,
    sendMessage,
    isLoading: messagesLoading,
    isSending,
    loadMore,
    hasMore,
    accessDenied,
  } = useMessages({
    communityId: communityId as string,
    type: 'community',
  });

  const {
    data: communityLeaderboard,
    isLoading: isLoadingLeaderboard,
    error: leaderboardError,
    refetch: refetchLeaderboard,
    isRefetching: isRefetchingLeaderboard,
  } = useQuery({
    queryKey: ['community-leaderboard', communityId, language],
    queryFn: () =>
      getCommunityLeaderboard(language as any, authSession, communityId as string, {
        page: 1,
        limit: 20,
      }),
    enabled: !!communityId && !!authSession,
  });

  const {
    data: communityClans,
    isLoading: isLoadingClanLb,
    error: clanLbError,
    refetch: refetchClanLb,
    isRefetching: isRefetchingClanLb,
  } = useQuery({
    queryKey: ['community-clan-leaderboard', communityId, language],
    queryFn: () =>
      getTopClans(language as any, authSession, {
        communityId: communityId as string,
        page: 1,
        limit: 20,
        sortBy: 'xp',
      }),
    enabled: !!communityId && !!authSession,
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

                    const formatTime = (dateString: string) => {
                      const date = new Date(dateString);
                      return date.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      });
                    };

                    const getInitial = (name?: string) => {
                      return name ? name.charAt(0).toUpperCase() : '?';
                    };

                    return (
                      <HStack
                        className={`px-4 py-2 ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                        space="xs"
                      >
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
            <ClansTab communityId={communityId as string} communityName={community?.name} />
          )}

          {activeTab === 'profile' && (
            <ProfileTab community={community} onViewAllClans={() => setActiveTab('clans')} />
          )}

          {activeTab === 'leaderboard' && (
            <ScrollView
              className="flex-1 bg-background-0"
              contentContainerStyle={{ padding: 16 }}
              refreshControl={
                <RefreshControl
                  refreshing={isRefetchingLeaderboard || isRefetchingClanLb}
                  onRefresh={() => {
                    refetchLeaderboard();
                    refetchClanLb();
                  }}
                  tintColor="#8b5cf6"
                />
              }
            >
              <HStack className="items-center justify-between mb-4">
                <Heading size="md" className="text-typography-900">
                  Community Leaderboard
                </Heading>
                <Text className="text-xs text-typography-500">Top 20</Text>
              </HStack>

              <HStack space="sm" className="mb-4">
                {(
                  [
                    { id: 'members', label: 'Members' },
                    { id: 'clans', label: 'Clans' },
                  ] as const
                ).map(tab => {
                  const isActive = activeCommunityLeaderboard === tab.id;
                  return (
                    <Pressable
                      key={tab.id}
                      onPress={() => setActiveCommunityLeaderboard(tab.id)}
                      className={`flex-1 items-center justify-center rounded-full border px-3 py-2 ${
                        isActive
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-outline-200 bg-background-0'
                      }`}
                    >
                      <Text
                        className={`text-sm font-semibold ${
                          isActive ? 'text-primary-700' : 'text-typography-600'
                        }`}
                      >
                        {tab.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </HStack>

              {(() => {
                const showingClans = activeCommunityLeaderboard === 'clans';
                const loading = showingClans ? isLoadingClanLb : isLoadingLeaderboard;
                const err = showingClans ? clanLbError : leaderboardError;
                const results = showingClans
                  ? communityClans?.results ?? []
                  : communityLeaderboard?.results ?? [];

                if (loading) {
                  return (
                    <Center className="py-10">
                      <Spinner size="large" />
                      <Text className="mt-3 text-sm text-typography-500">
                        Loading leaderboard...
                      </Text>
                    </Center>
                  );
                }

                if (err) {
                  return (
                    <Center className="py-10">
                      <Text className="text-center text-sm text-error-500">
                        {err instanceof Error ? err.message : 'Failed to load leaderboard'}
                      </Text>
                    </Center>
                  );
                }

                if ((results?.length || 0) === 0) {
                  return (
                    <Center className="py-10">
                      <Text className="text-typography-500">No leaderboard data yet.</Text>
                    </Center>
                  );
                }

                if (showingClans) {
                  const clans = results as any[];
                  return (
                    <VStack space="sm">
                      {clans.map((clan, index) => (
                        <HStack
                          key={clan.id}
                          className="items-center justify-between rounded-xl border border-outline-200 bg-background-50 px-4 py-3"
                        >
                          <HStack space="md" className="items-center">
                            <Box className="h-9 w-9 items-center justify-center rounded-full bg-primary-100">
                              <Text className="text-sm font-semibold text-primary-700">{index + 1}</Text>
                            </Box>
                            <VStack>
                              <Text className="text-base font-semibold text-typography-900">
                                {clan.name}
                              </Text>
                              <Text className="text-xs text-typography-500">
                                Members {clan.memberCount} • Limit {clan.limit}
                              </Text>
                            </VStack>
                          </HStack>
                          <VStack className="items-end">
                            <Text className="text-sm font-semibold text-typography-900">
                              {clan.xp} XP
                            </Text>
                          </VStack>
                        </HStack>
                      ))}
                    </VStack>
                  );
                }

                const members = results as any[];
                return (
                  <VStack space="sm">
                    {members.map((member, index) => (
                      <HStack
                        key={member.id}
                        className="items-center justify-between rounded-xl border border-outline-200 bg-background-50 px-4 py-3"
                      >
                        <HStack space="md" className="items-center">
                          <Box className="h-9 w-9 items-center justify-center rounded-full bg-primary-100">
                            <Text className="text-sm font-semibold text-primary-700">{index + 1}</Text>
                          </Box>
                          <VStack>
                            <Text className="text-base font-semibold text-typography-900">
                              {member.user?.UserName || 'Unknown'}
                            </Text>
                            <Text className="text-xs text-typography-500">Level {member.level}</Text>
                          </VStack>
                        </HStack>
                        <VStack className="items-end">
                          <Text className="text-sm font-semibold text-typography-900">
                            {member.totalXP} XP
                          </Text>
                        </VStack>
                      </HStack>
                    ))}
                  </VStack>
                );
              })()}
            </ScrollView>
          )}

          {activeTab === 'quests' && (
            <ScrollView className="flex-1 bg-background-0" contentContainerStyle={{ padding: 16 }}>
              <HStack space="sm" className="mb-4">
                {(
                  [
                    { id: 'daily', label: 'Daily' },
                    { id: 'weekly', label: 'Weekly' },
                  ] as const
                ).map(tab => {
                  const isActive = activeQuestTab === tab.id;
                  return (
                    <Pressable
                      key={tab.id}
                      onPress={() => setActiveQuestTab(tab.id)}
                      className={`flex-1 items-center justify-center rounded-full border px-3 py-2 ${
                        isActive
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-outline-200 bg-background-0'
                      }`}
                    >
                      <Text
                        className={`text-sm font-semibold ${
                          isActive ? 'text-primary-700' : 'text-typography-600'
                        }`}
                      >
                        {tab.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </HStack>

              {(() => {
                const showingWeekly = activeQuestTab === 'weekly';
                const loading = showingWeekly ? isLoadingWeekly : isLoadingDaily;
                const err = showingWeekly ? weeklyError : dailyError;
                const quests = showingWeekly ? thisWeekCommunityQuests : todaysCommunityQuests;

                if (loading) {
                  return (
                    <Center className="py-10">
                      <Spinner size="large" />
                      <Text className="mt-3 text-sm text-typography-500">Loading quests...</Text>
                    </Center>
                  );
                }

                if (err) {
                  return (
                    <Center className="py-10">
                      <Text className="text-center text-sm text-error-500">
                        {err instanceof Error ? err.message : 'Failed to load quests'}
                      </Text>
                    </Center>
                  );
                }

                if (!quests || quests.length === 0) {
                  return (
                    <Center className="py-10">
                      <Text className="text-center text-typography-500">
                        {showingWeekly
                          ? 'No weekly quests for this community this week.'
                          : 'No daily quests for this community today.'}
                      </Text>
                    </Center>
                  );
                }

                return (
                  <VStack space="md">
                    {quests.map(quest => {
                      const timer = getTimerState(quest);
                      const loadingState = actionLoading[quest.id];
                      const isStarting = loadingState === 'start';
                      const isCompleting = loadingState === 'complete';

                      return (
                        <Box
                          key={quest.id}
                          className="rounded-xl border border-outline-200 bg-background-50 p-4"
                        >
                          <VStack space="sm">
                            <HStack className="items-center justify-between">
                              <Text className="text-xs font-semibold uppercase text-primary-600">
                                {showingWeekly ? 'Weekly' : 'Daily'} • XP {quest.xpValue}
                              </Text>
                              <Text className="text-[10px] text-typography-400">Seq {quest.periodSeq}</Text>
                            </HStack>
                            <Text className="text-base font-semibold text-typography-900">
                              {quest.description}
                            </Text>
                            {quest.estimatedMinutes ? (
                              <Text className="text-xs text-typography-500">Est. {quest.estimatedMinutes} min</Text>
                            ) : null}

                            <HStack className="items-center justify-between">
                              <Text
                                className={`text-xs font-medium ${
                                  quest.isCompleted
                                    ? 'text-success-600'
                                    : quest.startedAt
                                      ? timer.label
                                      : 'text-typography-500'
                                }`}
                              >
                                {quest.isCompleted
                                  ? 'Completed'
                                  : quest.startedAt
                                    ? timer.label
                                    : 'Not started'}
                              </Text>
                              <Text className="text-[11px] text-typography-400">
                                {quest.periodStatus || (showingWeekly ? 'THIS_WEEK' : 'TODAY')}
                              </Text>
                            </HStack>

                            {!quest.isCompleted && (
                              <HStack space="sm" className="pt-2">
                                {!quest.startedAt ? (
                                  <Pressable
                                    onPress={() => {
                                      setLoadingState(quest.id, 'start');
                                      startQuestMutation.mutate(quest.id);
                                    }}
                                    disabled={isStarting}
                                    className={`flex-1 items-center justify-center rounded-lg px-4 py-2 ${
                                      isStarting ? 'bg-primary-300' : 'bg-primary-600'
                                    }`}
                                  >
                                    <Text className="font-semibold text-white">
                                      {isStarting ? 'Starting…' : 'Start'}
                                    </Text>
                                  </Pressable>
                                ) : (
                                  <Pressable
                                    onPress={() => {
                                      setLoadingState(quest.id, 'complete');
                                      completeQuestMutation.mutate(quest.id);
                                    }}
                                    disabled={!timer.isReady || isCompleting}
                                    className={`flex-1 items-center justify-center rounded-lg px-4 py-2 ${
                                      !timer.isReady || isCompleting
                                        ? 'bg-typography-300'
                                        : 'bg-success-600'
                                    }`}
                                  >
                                    <Text className="font-semibold text-white">
                                      {isCompleting
                                        ? 'Completing…'
                                        : timer.isReady
                                          ? 'Complete'
                                          : `Ready in ${timer.remainingMinutes}m`}
                                    </Text>
                                  </Pressable>
                                )}
                              </HStack>
                            )}
                          </VStack>
                        </Box>
                      );
                    })}
                  </VStack>
                );
              })()}
            </ScrollView>
          )}

          {activeTab !== 'chat' &&
            activeTab !== 'clans' &&
            activeTab !== 'profile' &&
            activeTab !== 'quests' &&
            activeTab !== 'leaderboard' && (
              <Center className="flex-1">
                <Text className="capitalize text-typography-500">
                  {activeTab} for {community.name} coming soon
                </Text>
              </Center>
            )}
        </VStack>
      </KeyboardAvoidingView>

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
        communityId={communityId as string}
      />

      <InviteMembersModal
        visible={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        communityId={communityId as string}
        communityName={community?.name}
        isOwner={community?.ownerId === currentUserId}
      />

      <TransferOwnershipModal
        visible={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        communityId={communityId as string}
        communityName={community?.name}
      />
    </SafeAreaView>
  );
}
