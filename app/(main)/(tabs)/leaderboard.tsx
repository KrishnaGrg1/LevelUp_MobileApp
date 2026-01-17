import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl } from 'react-native';

import {
  getGlobalLeaderboard,
  getTopClans,
  getTopCommunities,
  TopClan,
  TopCommunity,
} from '@/api/endPoints/leaderboard';
import { Box } from '@/components/ui/box';
import { Center } from '@/components/ui/center';
import { HStack } from '@/components/ui/hstack';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import authStore from '@/stores/auth.store';
import LanguageStore from '@/stores/language.store';
import { useQuery } from '@tanstack/react-query';
import { Crown } from 'lucide-react-native';

export default function LeaderboardTab() {
  const language = LanguageStore.getState().language;
  const authSession = authStore.getState().authSession as string;

  const [activeCategory, setActiveCategory] = useState<'users' | 'communities' | 'clans'>(
    'users',
  );

  const globalQuery = useQuery({
    queryKey: ['global-leaderboard', language],
    queryFn: () => getGlobalLeaderboard(language, authSession, { page: 1, limit: 20 }),
    enabled: !!authSession,
  });

  const topCommunitiesQuery = useQuery({
    queryKey: ['top-communities', language],
    queryFn: () => getTopCommunities(language, authSession, { page: 1, limit: 20, sortBy: 'xp' }),
    enabled: !!authSession && activeCategory === 'communities',
  });

  const topClansQuery = useQuery({
    queryKey: ['top-clans', language],
    queryFn: () => getTopClans(language, authSession, { page: 1, limit: 20, sortBy: 'xp' }),
    enabled: !!authSession && activeCategory === 'clans',
  });

  const { results, isLoading, isRefetching, error, refetch } = useMemo(() => {
    if (activeCategory === 'communities') {
      return {
        results: topCommunitiesQuery.data?.results ?? [],
        isLoading: topCommunitiesQuery.isLoading,
        isRefetching: topCommunitiesQuery.isRefetching,
        error: topCommunitiesQuery.error,
        refetch: topCommunitiesQuery.refetch,
      } as const;
    }

    if (activeCategory === 'clans') {
      return {
        results: topClansQuery.data?.results ?? [],
        isLoading: topClansQuery.isLoading,
        isRefetching: topClansQuery.isRefetching,
        error: topClansQuery.error,
        refetch: topClansQuery.refetch,
      } as const;
    }

    return {
      results: globalQuery.data?.results ?? [],
      isLoading: globalQuery.isLoading,
      isRefetching: globalQuery.isRefetching,
      error: globalQuery.error,
      refetch: globalQuery.refetch,
    } as const;
  }, [activeCategory, globalQuery, topClansQuery, topCommunitiesQuery]);

  const headerTitle = useMemo(() => {
    if (activeCategory === 'communities') return 'Community Leaderboard';
    if (activeCategory === 'clans') return 'Clan Leaderboard';
    return 'Global Leaderboard';
  }, [activeCategory]);

  return (
    <Box className="flex-1 bg-background-50">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#8b5cf6" />
        }
        contentContainerStyle={{ padding: 16 }}
      >
        <HStack className="items-center justify-between mb-4">
          <HStack space="sm" className="items-center">
            <Crown size={20} color="#f59e0b" />
            <Text className="text-lg font-semibold text-typography-900">{headerTitle}</Text>
          </HStack>
          <Text className="text-xs text-typography-500">Top 20</Text>
        </HStack>

        <HStack space="sm" className="mb-4">
          {(
            [
              { id: 'users', label: 'Users' },
              { id: 'communities', label: 'Communities' },
              { id: 'clans', label: 'Clans' },
            ] as const
          ).map(tab => {
            const isActive = activeCategory === tab.id;
            return (
              <Pressable
                key={tab.id}
                onPress={() => setActiveCategory(tab.id)}
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

        {isLoading ? (
          <Center className="py-10">
            <ActivityIndicator size="large" color="#8b5cf6" />
            <Text className="mt-3 text-sm text-typography-500">Loading leaderboard...</Text>
          </Center>
        ) : error ? (
          <Center className="py-10">
            <Text className="text-center text-error-500">
              {error instanceof Error ? error.message : 'Failed to load leaderboard'}
            </Text>
          </Center>
        ) : results.length === 0 ? (
          <Center className="py-10">
            <Text className="text-typography-500">No leaderboard data yet.</Text>
          </Center>
        ) : (
          <VStack space="sm">
            {results.map((item: any, index: number) => {
              if (activeCategory === 'communities') {
                const community = item as TopCommunity;
                return (
                  <HStack
                    key={community.id}
                    className="items-center justify-between rounded-xl border border-outline-200 bg-background-0 px-4 py-3"
                  >
                    <HStack space="md" className="items-center">
                      <Box className="h-9 w-9 items-center justify-center rounded-full bg-primary-100">
                        <Text className="text-sm font-semibold text-primary-700">{index + 1}</Text>
                      </Box>
                      <VStack>
                        <Text className="text-base font-semibold text-typography-900">
                          {community.name}
                        </Text>
                        <Text className="text-xs text-typography-500">
                          Members {community.memberCount} • Limit {community.memberLimit}
                        </Text>
                      </VStack>
                    </HStack>
                    <VStack className="items-end">
                      <Text className="text-sm font-semibold text-typography-900">
                        {community.xp} XP
                      </Text>
                    </VStack>
                  </HStack>
                );
              }

              if (activeCategory === 'clans') {
                const clan = item as TopClan;
                return (
                  <HStack
                    key={clan.id}
                    className="items-center justify-between rounded-xl border border-outline-200 bg-background-0 px-4 py-3"
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
                          Members {clan.memberCount} • Community {clan.communityId}
                        </Text>
                      </VStack>
                    </HStack>
                    <VStack className="items-end">
                      <Text className="text-sm font-semibold text-typography-900">
                        {clan.xp} XP
                      </Text>
                    </VStack>
                  </HStack>
                );
              }

              // Default: global users
              return (
                <HStack
                  key={item.id}
                  className="items-center justify-between rounded-xl border border-outline-200 bg-background-0 px-4 py-3"
                >
                  <HStack space="md" className="items-center">
                    <Box className="h-9 w-9 items-center justify-center rounded-full bg-primary-100">
                      <Text className="text-sm font-semibold text-primary-700">{index + 1}</Text>
                    </Box>
                    <VStack>
                      <Text className="text-base font-semibold text-typography-900">
                        {item.UserName || 'Unknown'}
                      </Text>
                      <Text className="text-xs text-typography-500">Level {item.level}</Text>
                    </VStack>
                  </HStack>
                  <VStack className="items-end">
                    <Text className="text-sm font-semibold text-typography-900">{item.xp} XP</Text>
                    <Text className="text-[11px] text-typography-500">{item.tokens} tokens</Text>
                  </VStack>
                </HStack>
              );
            })}
          </VStack>
        )}
      </ScrollView>
    </Box>
  );
}
