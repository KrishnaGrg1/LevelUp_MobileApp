import {
    completeQuest,
    fetchDailyQuests,
    fetchWeeklyQuests,
    generateDailyQuests,
    generateWeeklyQuests,
    startQuest,
} from '@/api/endPoints/ai-quests';
import type { Quest } from '@/api/types/ai';
import QuestCard from '@/components/quests/QuestCard';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import LanguageStore from '@/stores/language.store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Alert, RefreshControl } from 'react-native';

interface AIQuestsComponentProps {
  communityId?: string;
  showTitle?: boolean;
}

const languageSelector = (state: any) => state.language;

export default function AIQuestsComponent({
  communityId,
  showTitle = true,
}: AIQuestsComponentProps) {
  // 1. State hooks
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');

  // 2. Query Client (Context hook)
  const queryClient = useQueryClient();

  // 3. Store hook
  const language = LanguageStore(languageSelector);

  // 4. Fetch daily quests
  const {
    data: dailyData,
    isLoading: dailyLoading,
    refetch: refetchDaily,
  } = useQuery({
    queryKey: ['daily-quests', language],
    queryFn: () => fetchDailyQuests(language),
  });

  // 5. Fetch weekly quests
  const {
    data: weeklyData,
    isLoading: weeklyLoading,
    refetch: refetchWeekly,
  } = useQuery({
    queryKey: ['weekly-quests', language],
    queryFn: () => fetchWeeklyQuests(language),
  });

  // 6. Generate daily quests mutation
  const generateDailyMutation = useMutation({
    mutationFn: () => generateDailyQuests(language),
    onSuccess: () => {
      Alert.alert('Success', 'Daily quests generated successfully!');
      queryClient.invalidateQueries({ queryKey: ['daily-quests'] });
    },
    onError: (error: Error) => {
      Alert.alert('Error', error.message || 'Failed to generate daily quests');
    },
  });

  // 7. Generate weekly quests mutation
  const generateWeeklyMutation = useMutation({
    mutationFn: () => generateWeeklyQuests(language),
    onSuccess: () => {
      Alert.alert('Success', 'Weekly quests generated successfully!');
      queryClient.invalidateQueries({ queryKey: ['weekly-quests'] });
    },
    onError: (error: Error) => {
      Alert.alert('Error', error.message || 'Failed to generate weekly quests');
    },
  });

  // 8. Start quest mutation
  const startMutation = useMutation({
    mutationFn: (questId: string) => startQuest(questId, language),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-quests'] });
      queryClient.invalidateQueries({ queryKey: ['weekly-quests'] });
    },
    onError: (error: Error) => {
      Alert.alert('Error', error.message || 'Failed to start quest');
    },
  });

  // 9. Complete quest mutation
  const completeMutation = useMutation({
    mutationFn: (questId: string) => completeQuest(questId, language),
    onSuccess: (response: any) => {
      const data = response.body.data;
      const rewards = [
        `+${data.xpAwarded} XP`,
        data.tokensAwarded ? `+${data.tokensAwarded} Tokens` : null,
      ]
        .filter(Boolean)
        .join(', ');

      Alert.alert(
        '🎉 Quest Complete!',
        `${rewards}\n\nLevel: ${data.currentLevel}\nTotal XP: ${data.currentXp}`,
        [{ text: 'Awesome!', style: 'default' }],
      );

      queryClient.invalidateQueries({ queryKey: ['daily-quests'] });
      queryClient.invalidateQueries({ queryKey: ['weekly-quests'] });
    },
    onError: (error: Error) => {
      Alert.alert('Error', error.message || 'Failed to complete quest');
    },
  });

  const handleRefresh = () => {
    refetchDaily();
    refetchWeekly();
  };

  const isRefreshing = dailyLoading || weeklyLoading;
  const isActionLoading =
    startMutation.isPending ||
    completeMutation.isPending ||
    generateDailyMutation.isPending ||
    generateWeeklyMutation.isPending;

  // Filter logic remains inside of function but below hooks
  const filterQuestList = (list: Quest[] | undefined) => {
    if (!list) return [];
    if (!communityId) return list;
    return list.filter((q: Quest) => q.communityId === communityId);
  };

  const todayQuests = filterQuestList(dailyData?.body?.data?.today);
  const yesterdayQuests = filterQuestList(dailyData?.body?.data?.yesterday);
  const thisWeekQuests = filterQuestList(weeklyData?.body?.data?.thisWeek);
  const lastWeekQuests = filterQuestList(weeklyData?.body?.data?.lastWeek);

  return (
    <Box className="flex-1 bg-background-0 dark:bg-background-950">
      {/* Header */}
      <VStack space="md" className="p-4 bg-primary-500">
        {showTitle && (
          <Heading size="xl" className="text-white">
            AI Quests
          </Heading>
        )}

        {/* Tab Switcher */}
        <Box className="flex-row bg-background-0 rounded-lg p-1">
          <Button
            className="flex-1"
            variant={activeTab === 'daily' ? 'solid' : 'outline'}
            action={activeTab === 'daily' ? 'primary' : 'secondary'}
            onPress={() => setActiveTab('daily')}
          >
            <ButtonText>Daily</ButtonText>
          </Button>
          <Button
            className="flex-1"
            variant={activeTab === 'weekly' ? 'solid' : 'outline'}
            action={activeTab === 'weekly' ? 'primary' : 'secondary'}
            onPress={() => setActiveTab('weekly')}
          >
            <ButtonText>Weekly</ButtonText>
          </Button>
        </Box>
      </VStack>

      {/* Content */}
      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
      >
        <VStack space="lg" className="p-4">
          {activeTab === 'daily' ? (
            <>
              {/* Today's Quests */}
              <VStack space="sm">
                <Box className="flex-row justify-between items-center mb-2">
                  <Heading size="lg">Today</Heading>
                  <Button
                    size="sm"
                    variant="outline"
                    action="secondary"
                    onPress={() => generateDailyMutation.mutate()}
                    isDisabled={generateDailyMutation.isPending}
                  >
                    <ButtonText>Generate New</ButtonText>
                  </Button>
                </Box>
                {todayQuests.length > 0 ? (
                  todayQuests.map((quest: Quest) => (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      onStart={startMutation.mutate}
                      onComplete={completeMutation.mutate}
                      isLoading={isActionLoading}
                    />
                  ))
                ) : (
                  <Box className="p-6 bg-background-100 dark:bg-background-900 rounded-lg items-center">
                    <Text size="md" className="text-typography-600 dark:text-typography-400">
                      No quests available today
                    </Text>
                  </Box>
                )}
              </VStack>

              {/* Yesterday's Quests */}
              {yesterdayQuests.length > 0 && (
                <VStack space="sm">
                  <Heading size="md" className="text-typography-600 dark:text-typography-400">
                    Yesterday
                  </Heading>
                  {yesterdayQuests.map((quest: Quest) => (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      onStart={startMutation.mutate}
                      onComplete={completeMutation.mutate}
                      isLoading={isActionLoading}
                    />
                  ))}
                </VStack>
              )}
            </>
          ) : (
            <>
              {/* This Week's Quests */}
              <VStack space="sm">
                <Box className="flex-row justify-between items-center mb-2">
                  <Heading size="lg">This Week</Heading>
                  <Button
                    size="sm"
                    variant="outline"
                    action="secondary"
                    onPress={() => generateWeeklyMutation.mutate()}
                    isDisabled={generateWeeklyMutation.isPending}
                  >
                    <ButtonText>Generate New</ButtonText>
                  </Button>
                </Box>
                {thisWeekQuests.length > 0 ? (
                  thisWeekQuests.map((quest: Quest) => (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      onStart={startMutation.mutate}
                      onComplete={completeMutation.mutate}
                      isLoading={isActionLoading}
                    />
                  ))
                ) : (
                  <Box className="p-6 bg-background-100 dark:bg-background-900 rounded-lg items-center">
                    <Text size="md" className="text-typography-600 dark:text-typography-400">
                      No quests available this week
                    </Text>
                  </Box>
                )}
              </VStack>

              {/* Last Week's Quests */}
              {lastWeekQuests.length > 0 && (
                <VStack space="sm">
                  <Heading size="md" className="text-typography-600 dark:text-typography-400">
                    Last Week
                  </Heading>
                  {lastWeekQuests.map((quest: Quest) => (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                      onStart={startMutation.mutate}
                      onComplete={completeMutation.mutate}
                      isLoading={isActionLoading}
                    />
                  ))}
                </VStack>
              )}
            </>
          )}
        </VStack>
      </ScrollView>
    </Box>
  );
}
