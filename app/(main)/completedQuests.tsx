import { fetchCompletedQuests } from '@/api/endPoints/ai-quests';
import type { Quest } from '@/api/types/ai';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import LanguageStore from '@/stores/language.store';
import { formatQuestPeriod, getQuestBadgeColor } from '@/utils/questUtils';
import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';

const CompletedQuestsScreen = () => {
  const language = LanguageStore(state => state.language);
  const [filter, setFilter] = useState<'Daily' | 'Weekly' | undefined>(undefined);

  const {
    data,
    isLoading,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['completed-quests', language, filter],
    queryFn: ({ pageParam = 1 }) => fetchCompletedQuests(language, pageParam, 20, filter),
    getNextPageParam: lastPage => {
      const pagination = lastPage.body.data.pagination;
      return pagination.hasMore ? pagination.page + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const quests = data?.pages.flatMap(page => page.body.data.quests) || [];

  const renderQuest = ({ item: quest }: { item: Quest }) => {
    const badgeColor = getQuestBadgeColor(quest.type);

    return (
      <Box className="bg-background-0 dark:bg-background-900 rounded-xl p-4 mb-3 border border-outline-200 dark:border-outline-800">
        <Box className="flex-row justify-between mb-2">
          <Badge size="md" variant="solid" className={badgeColor.backgroundColor}>
            <BadgeText className={badgeColor.color}>{quest.type}</BadgeText>
          </Badge>
          <Box className="flex-row items-center gap-1">
            <Text size="lg" bold className="text-typography-900 dark:text-typography-50">
              {quest.xpValue}
            </Text>
            <Text size="xs" className="text-typography-600 dark:text-typography-400">
              XP
            </Text>
          </Box>
        </Box>

        <Text size="md" className="text-typography-900 dark:text-typography-50 mb-2">
          {quest.description}
        </Text>

        <Box className="flex-row justify-between">
          <Text size="sm" className="text-typography-500 dark:text-typography-400">
            {formatQuestPeriod(quest.periodStatus)}
          </Text>
          {quest.completedAt && (
            <Text size="sm" className="text-success-600 dark:text-success-400">
              ✓ Completed
            </Text>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Box className="flex-1 bg-background-0 dark:bg-background-950">
      {/* Header */}
      <VStack space="md" className="p-4 bg-primary-500">
        <Heading size="xl" className="text-white">
          Completed Quests
        </Heading>

        {/* Filter */}
        <Box className="flex-row gap-2">
          <Button
            size="sm"
            variant={filter === undefined ? 'solid' : 'outline'}
            action={filter === undefined ? 'primary' : 'secondary'}
            onPress={() => setFilter(undefined)}
          >
            <ButtonText>All</ButtonText>
          </Button>
          <Button
            size="sm"
            variant={filter === 'Daily' ? 'solid' : 'outline'}
            action={filter === 'Daily' ? 'primary' : 'secondary'}
            onPress={() => setFilter('Daily')}
          >
            <ButtonText>Daily</ButtonText>
          </Button>
          <Button
            size="sm"
            variant={filter === 'Weekly' ? 'solid' : 'outline'}
            action={filter === 'Weekly' ? 'primary' : 'secondary'}
            onPress={() => setFilter('Weekly')}
          >
            <ButtonText>Weekly</ButtonText>
          </Button>
        </Box>
      </VStack>

      {/* Quest List */}
      <FlatList
        data={quests}
        renderItem={renderQuest}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <Box className="p-6 bg-background-100 dark:bg-background-900 rounded-lg">
            <Text size="md" className="text-typography-600 dark:text-typography-400 text-center">
              No completed quests yet
            </Text>
          </Box>
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <Box className="py-4 items-center">
              <Text size="sm" className="text-typography-600 dark:text-typography-400">
                Loading more...
              </Text>
            </Box>
          ) : null
        }
      />
    </Box>
  );
};

export default CompletedQuestsScreen;
