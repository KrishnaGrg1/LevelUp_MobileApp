import React, { useMemo, useState } from 'react';
import { RefreshControl } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Badge, BadgeText } from '@/components/ui/badge';
import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { completeQuest, fetchDailyQuests, fetchWeeklyQuests, Quest, startQuest } from '@/api/endPoints/ai';
import { getMyCommunities } from '@/api/endPoints/communities';
import authStore from '@/stores/auth.store';
import LanguageStore from '@/stores/language.store';
import { useTranslation } from '@/translation';
import { Calendar, CheckCircle2, Clock, Flame, Trophy, Users, Zap } from 'lucide-react-native';

type QuestWithCommunity = Quest & { communityName?: string; community?: { name?: string | null } | null };

function QuestsTab() {
  const { t } = useTranslation();
  const language = LanguageStore.getState().language;
  const authSession = authStore.getState().authSession as string;
  const currentUserId = authStore.getState().user?.id;
  const queryClient = useQueryClient();

  const [activeQuestTab, setActiveQuestTab] = useState<'daily' | 'weekly'>('daily');

  // Fetch all communities for mapping id to name
  const { data: myCommunities } = useQuery({
    queryKey: ['my-communities', language, authSession],
    queryFn: () => getMyCommunities(language as any, authSession),
    enabled: !!authSession,
  });

  // Build a map of communityId to name
  const communityIdToName = useMemo(() => {
    const map: Record<string, string> = {};
    // getMyCommunities returns { body: { data: Community[] } }
    const communities = myCommunities?.body?.data;
    if (Array.isArray(communities)) {
      for (const c of communities) {
        map[c.id] = c.name;
      }
    }
    return map;
  }, [myCommunities]);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState<Record<string, 'start' | 'complete' | null>>(
    {},
  );

  const {
    data: dailyQuests,
    isLoading: isLoadingDaily,
    error: dailyError,
    refetch: refetchDaily,
  } = useQuery({
    queryKey: ['daily-quests', currentUserId, language],
    queryFn: () => fetchDailyQuests(language as any, authSession),
    enabled: !!authSession && !!currentUserId,
  });

  const {
    data: weeklyQuests,
    isLoading: isLoadingWeekly,
    error: weeklyError,
    refetch: refetchWeekly,
  } = useQuery({
    queryKey: ['weekly-quests', currentUserId, language],
    queryFn: () => fetchWeeklyQuests(language as any, authSession),
    enabled: !!authSession && !!currentUserId,
  });

  // Group daily and weekly quests by communityId
  const todaysQuestsByCommunity = useMemo(() => {
    const quests = dailyQuests?.body?.data?.today || [];
    const map: Record<string, QuestWithCommunity[]> = {};
    for (const quest of quests) {
      const key = quest.communityId || 'personal';
      if (!map[key]) map[key] = [];
      map[key].push(quest);
    }
    return map;
  }, [dailyQuests?.body?.data?.today]);

  const weeklyQuestsByCommunity = useMemo(() => {
    const quests = weeklyQuests?.body?.data?.thisWeek || [];
    const map: Record<string, QuestWithCommunity[]> = {};
    for (const quest of quests) {
      const key = quest.communityId || 'personal';
      if (!map[key]) map[key] = [];
      map[key].push(quest);
    }
    return map;
  }, [weeklyQuests?.body?.data?.thisWeek]);

  const setLoadingState = (questId: string, state: 'start' | 'complete' | null) => {
    setActionLoading(prev => ({ ...prev, [questId]: state }));
  };

  const startQuestMutation = useMutation({
    mutationFn: (questId: string) => startQuest(questId, language as any, authSession),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-quests', currentUserId, language] });
      queryClient.invalidateQueries({ queryKey: ['weekly-quests', currentUserId, language] });
    },
    onSettled: (_data, _error, questId) => setLoadingState(questId, null),
  });

  const completeQuestMutation = useMutation({
    mutationFn: (questId: string) => completeQuest(questId, language as any, authSession),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-quests', currentUserId, language] });
      queryClient.invalidateQueries({ queryKey: ['weekly-quests', currentUserId, language] });
    },
    onSettled: (_data, _error, questId) => setLoadingState(questId, null),
  });

  const getTimerState = (quest: Quest) => {
    const estimated = quest.estimatedMinutes ?? 30;
    if (!quest.startedAt) {
      return { isReady: false, remainingMinutes: estimated, label: `Est. ${estimated} min required` };
    }
    const startMs = new Date(quest.startedAt).getTime();
    const endMs = startMs + estimated * 60 * 1000;
    const remainingMs = endMs - Date.now();
    const remainingMinutes = Math.max(0, Math.ceil(remainingMs / (60 * 1000)));
    return {
      isReady: remainingMs <= 0,
      remainingMinutes,
      label: remainingMs <= 0 ? 'Ready to complete' : `Ready in ${remainingMinutes} min`,
    };
  };

  const activeQuestsByCommunity = activeQuestTab === 'weekly' ? weeklyQuestsByCommunity : todaysQuestsByCommunity;
  const allActiveQuests = Object.values(activeQuestsByCommunity).flat();
  const completed = allActiveQuests.filter(q => q.isCompleted);
  const pending = allActiveQuests.filter(q => !q.isCompleted);

  const isLoading = activeQuestTab === 'weekly' ? isLoadingWeekly : isLoadingDaily;
  const loadError = activeQuestTab === 'weekly' ? weeklyError : dailyError;

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchDaily(), refetchWeekly()]);
    setRefreshing(false);
  };

  const stats = {
    total: allActiveQuests.length,
    completed: completed.length,
    streak: 0,
    totalXP: allActiveQuests.reduce((sum: number, q: QuestWithCommunity) => sum + (q.xpValue || 0), 0),
  };

  return (
    <ScrollView
      className="flex-1 bg-background-0"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Box className="bg-primary-500 px-6 pb-8 pt-12">
        <Heading size="3xl" className="text-white">
          {t('quests.title', 'Quests')}
        </Heading>
        <Text className="mt-2 text-primary-100">{t('quests.subtitle', 'Earn XP daily & weekly')}</Text>

        <HStack className="mt-6" space="md">
          <Card className="flex-1 border-0 bg-white p-3 shadow-sm dark:bg-background-900">
            <Icon as={Trophy} size="md" className="text-yellow-500" />
            <Text className="mt-2 text-xl font-bold text-typography-900">
              {stats.completed}/{stats.total}
            </Text>
            <Text className="text-xs text-typography-500">{t('quests.completed', 'Completed')}</Text>
          </Card>
          <Card className="flex-1 border-0 bg-white p-3 shadow-sm dark:bg-background-900">
            <Icon as={Flame} size="md" className="text-orange-500" />
            <Text className="mt-2 text-xl font-bold text-typography-900">{stats.streak}</Text>
            <Text className="text-xs text-typography-500">{t('quests.streak', 'Week Streak')}</Text>
          </Card>
          <Card className="flex-1 border-0 bg-white p-3 shadow-sm dark:bg-background-900">
            <Icon as={Zap} size="md" className="text-purple-500" />
            <Text className="mt-2 text-xl font-bold text-typography-900">{stats.totalXP}</Text>
            <Text className="text-xs text-typography-500">{t('quests.totalXP', 'Total XP')}</Text>
          </Card>
        </HStack>
      </Box>

      <Box className="px-6 py-6">
        <HStack className="mb-4" space="md">
          {(['daily', 'weekly'] as const).map(tab => {
            const isActive = activeQuestTab === tab;
            return (
              <Pressable
                key={tab}
                className={`flex-1 rounded-lg border py-3 ${
                  isActive ? 'border-typography-900 bg-typography-900' : 'border-outline-200 bg-transparent'
                }`}
                onPress={() => setActiveQuestTab(tab)}
              >
                <Text
                  className={`text-center font-semibold ${
                    isActive ? 'text-white' : 'text-typography-900'
                  }`}
                >
                  {tab === 'daily' ? t('quests.daily', 'Daily') : t('quests.weekly', 'Weekly')}
                </Text>
              </Pressable>
            );
          })}
        </HStack>

        {isLoading ? (
          <CenterState message={t('quests.loading', 'Loading quests...')} />
        ) : loadError ? (
          <CenterState
            message={loadError instanceof Error ? loadError.message : t('quests.error', 'Failed to load quests')}
            tone="error"
          />
        ) : allActiveQuests.length === 0 ? (
          <CenterState
            message={
              activeQuestTab === 'weekly'
                ? t('quests.noWeekly', 'No weekly quests available right now.')
                : t('quests.noDaily', 'No daily quests for today.')
            }
          />
        ) : (
          <VStack space="lg">
            {Object.entries(activeQuestsByCommunity).map(([communityId, quests]) => {
              // Use the community name from the fetched map, fallback to 'Personal' or id
              const communityName = communityId !== 'personal'
                ? (communityIdToName[communityId] || communityId)
                : t('quests.personal', 'Personal');
              return (
                <VStack key={communityId} space="md">
                  <Text className="text-base font-semibold text-typography-800">
                    {communityName}
                  </Text>
                  <VStack space="md">
                    {quests.map(quest => {
                      const timer = getTimerState(quest);
                      const loadingState = actionLoading[quest.id];
                      const isStarting = loadingState === 'start';
                      const isCompleting = loadingState === 'complete';

                      return (
                        <Card
                          key={quest.id}
                          className="border border-outline-200 bg-white p-4 shadow-sm dark:bg-background-900"
                        >
                          <HStack className="items-start justify-between" space="md">
                            <VStack className="flex-1" space="xs">
                              <HStack className="items-center" space="xs">
                                <Badge size="sm" variant="solid" className="border-0 bg-primary-500/90">
                                  <BadgeText>{activeQuestTab === 'weekly' ? 'Weekly' : 'Daily'}</BadgeText>
                                </Badge>
                                {communityName && communityId !== 'personal' ? (
                                  <Badge size="sm" variant="outline" className="border-outline-300">
                                    <BadgeText className="text-typography-900">{communityName}</BadgeText>
                                  </Badge>
                                ) : null}
                              </HStack>
                              <Text className="text-lg font-semibold text-typography-900">
                                {quest.description}
                              </Text>
                              {quest.estimatedMinutes ? (
                                <Text className="text-xs text-typography-500">
                                  Est. {quest.estimatedMinutes} min • XP {quest.xpValue}
                                </Text>
                              ) : (
                                <Text className="text-xs text-typography-500">XP {quest.xpValue}</Text>
                              )}
                              <Text className="text-[11px] text-typography-500 uppercase tracking-wide">
                                {quest.periodStatus || (activeQuestTab === 'weekly' ? 'THIS_WEEK' : 'TODAY')}
                              </Text>
                            </VStack>
                            <Box className="h-10 w-10 items-center justify-center rounded-full bg-background-100">
                              {quest.isCompleted ? (
                                <Icon as={CheckCircle2} size="md" className="text-green-500" />
                              ) : (
                                <Icon as={Clock} size="md" className="text-typography-500" />
                              )}
                            </Box>
                          </HStack>

                          <HStack className="mt-3 items-center justify-between">
                            <Text
                              className={`text-xs font-medium ${
                                quest.isCompleted
                                  ? 'text-success-600'
                                  : quest.startedAt
                                    ? 'text-primary-600'
                                    : 'text-typography-500'
                              }`}
                            >
                              {quest.isCompleted
                                ? t('quests.completedState', 'Completed')
                                : quest.startedAt
                                  ? timer.label
                                  : t('quests.notStarted', 'Not started')}
                            </Text>
                            <Text className="text-[11px] text-typography-400">Seq {quest.periodSeq}</Text>
                          </HStack>

                          {!quest.isCompleted && (
                            <HStack className="mt-4" space="sm">
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
                                    {isStarting ? t('quests.starting', 'Starting…') : t('quests.start', 'Start')}
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
                                    !timer.isReady || isCompleting ? 'bg-typography-300' : 'bg-success-600'
                                  }`}
                                >
                                  <Text className="font-semibold text-white">
                                    {isCompleting
                                      ? t('quests.completing', 'Completing…')
                                      : timer.isReady
                                        ? t('quests.complete', 'Complete')
                                        : `${t('quests.readyIn', 'Ready in')} ${timer.remainingMinutes}m`}
                                  </Text>
                                </Pressable>
                              )}
                            </HStack>
                          )}
                        </Card>
                      );
                    })}
                  </VStack>
                </VStack>
              );
            })} 
          </VStack>
        )}
      </Box>
    </ScrollView>
  );
}

function CenterState({ message, tone = 'info' }: { message: string; tone?: 'info' | 'error' }) {
  return (
    <Box className="py-16 items-center justify-center">
      <Text className={`text-center text-sm ${tone === 'error' ? 'text-error-500' : 'text-typography-500'}`}>
        {message}
      </Text>
    </Box>
  );
}

function groupQuestsByCommunity(quests: QuestWithCommunity[]) {
  const map = quests.reduce<Record<string, QuestWithCommunity[]>>((acc, quest) => {
    const name = quest.communityName || quest.community?.name || 'Personal';
    if (!acc[name]) acc[name] = [];
    acc[name].push(quest);
    return acc;
  }, {});

  return Object.entries(map).map(([label, list]) => ({ label, quests: list }));
}

export default React.memo(QuestsTab);
