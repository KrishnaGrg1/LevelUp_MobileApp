import { CommunityDTO } from '@/api/generated';
import { CreateCommunityModal } from '@/components/communities/CreateCommunityModal';
import { DiscoverCommunitiesModal } from '@/components/communities/DiscoverCommunitiesModal';
import { JoinWithCodeModal } from '@/components/communities/JoinWithCodeModal';
import { Avatar, AvatarFallbackText } from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { Center } from '@/components/ui/center';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useAllCommunities, useJoinCommunity, useMyCommunities } from '@/hooks/queries/useCommunities';
import { useThemeStore } from '@/stores/theme.store';
import { useTranslation } from '@/translation';
import { useRouter } from 'expo-router';
import { ChevronRight, Lock, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, FlatList, Image, Pressable } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

interface CommunityCardProps {
  community: CommunityDTO;
  onPress: () => void;
  onJoin: () => void;
  isJoining: boolean;
}

function CommunityCard({ community, onPress, onJoin, isJoining }: CommunityCardProps) {
  const { theme } = useThemeStore();
  const { t } = useTranslation();
  const isDark = theme === 'dark' || (theme === 'system' && false);
  const isMember = !!community.userRole;

  return (
    <Pressable onPress={onPress}>
      <Box
        className="mr-3 rounded-xl border-2 border-primary-500 bg-background-0 p-4"
        style={{ width: CARD_WIDTH }}
      >
        <VStack space="md">
          {/* Top Section: Avatar and Name */}
          <HStack space="md" className="items-center">
            {community.photo ? (
              <Box className="h-16 w-16 overflow-hidden rounded-full bg-primary-100">
                <Image
                  source={{ uri: community.photo }}
                  style={{ width: 64, height: 64 }}
                  resizeMode="cover"
                />
              </Box>
            ) : (
              <Avatar size="lg" className="bg-primary-100">
                <AvatarFallbackText>{community.name}</AvatarFallbackText>
              </Avatar>
            )}

            <VStack className="flex-1">
              <Heading size="md" className="text-white" numberOfLines={1}>
                {community.name}
              </Heading>
              {community.isPrivate && (
                <HStack space="xs" className="mt-1 items-center">
                  <Lock size={12} color="#8b5cf6" />
                  <Text className="text-xs text-primary-600 dark:text-primary-500">{t('dashboard.communities.privateCommunity')}</Text>
                </HStack>
              )}
            </VStack>

            <ChevronRight size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
          </HStack>

          {/* ... Role/Join Button ... */}

          {/* Member Count */}
          <HStack space="xs" className="items-center">
            <Users size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
            <Text className="text-sm text-typography-600 dark:text-typography-400">
              {community.currentMembers} / {community.maxMembers} {t('dashboard.communities.members')}
            </Text>
          </HStack>

          {/* Description */}
          {community.description && (
            <Text className="text-sm text-typography-500 dark:text-typography-400" numberOfLines={2}>
              {community.description}
            </Text>
          )}
        </VStack>
      </Box>
    </Pressable>
  );
}

function EmptyState({ message, subMessage }: { message: string; subMessage: string }) {
  return (
    <Center className="px-4 py-8">
      <VStack space="md" className="items-center">
        <Box className="h-16 w-16 items-center justify-center rounded-full bg-primary-100">
          <Users size={32} color="#8b5cf6" strokeWidth={1.5} />
        </Box>
        <VStack space="xs" className="items-center">
          <Text className="text-center text-base font-semibold text-typography-700">
            {message}
          </Text>
          <Text className="text-center text-sm text-typography-500">
            {subMessage}
          </Text>
        </VStack>
      </VStack>
    </Center>
  );
}

function CommunityGrid({
  data,
  onPress,
  onJoin,
  joiningId,
}: {
  data: CommunityDTO[];
  onPress: (id: string) => void;
  onJoin: (id: string) => void;
  joiningId: string | null;
}) {
  // Chunk data into groups of 2 for 2-row layout
  const chunkedData = React.useMemo(() => {
    const chunks = [];
    for (let i = 0; i < data.length; i += 2) {
      chunks.push(data.slice(i, i + 2));
    }
    return chunks;
  }, [data]);

  return (
    <FlatList
      horizontal
      data={chunkedData}
      keyExtractor={(_, index) => `chunk-${index}`}
      renderItem={({ item: chunk }) => (
        <VStack space="md" className="mr-3">
          {chunk.map((community) => (
            <CommunityCard
              key={community.id}
              community={community}
              onPress={() => onPress(community.id)}
              onJoin={() => onJoin(community.id)}
              isJoining={joiningId === community.id}
            />
          ))}
        </VStack>
      )}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16 }}
    />
  );
}

export function CommunitiesSection() {
  const router = useRouter();
  const { t } = useTranslation();
  const { data: communities, isLoading, isError, error } = useMyCommunities();
  const {
    data: allCommunities,
    isLoading: isAllLoading,
    error: allCommunitiesError,
    isError: isAllCommunitiesError,
  } = useAllCommunities();

  const { mutate: joinCommunity, isPending: isJoining } = useJoinCommunity();
  const [joiningId, setJoiningId] = useState<string | null>(null);

  const handleJoin = (communityId: string) => {
    setJoiningId(communityId);
    joinCommunity(communityId, {
      onSettled: () => setJoiningId(null),
    });
  };

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [discoverModalVisible, setDiscoverModalVisible] = useState(false);
  const [joinWithCodeModalVisible, setJoinWithCodeModalVisible] = useState(false);

  React.useEffect(() => {
    console.log('My Communities data:', communities);
    console.log('All Communities data:', allCommunities);
    console.log('All Communities Loading:', isAllLoading);
    if (allCommunitiesError) console.log('All Communities Error:', allCommunitiesError);
    if (isAllCommunitiesError) console.log('All Communities isError:', isAllCommunitiesError);
    if (error) console.log('My Communities Error:', error);
  }, [
    communities,
    allCommunities,
    isLoading,
    isAllLoading,
    isError,
    error,
    allCommunitiesError,
    isAllCommunitiesError,
  ]);

  const handleCommunityPress = (communityId: string) => {
    router.push(`/communities/${communityId}` as any);
  };



  if (isLoading) {
    return (
      <VStack space="md" className="py-4">
        <HStack className="items-center justify-between px-4">
          <Heading size="lg" className="text-typography-900 dark:text-white">
            {t('dashboard.communities.title')}
          </Heading>
        </HStack>
        <Center className="py-8">
          <Spinner size="large" />
          <Text className="mt-2 text-sm text-typography-500">Loading...</Text>
        </Center>
      </VStack>
    );
  }

  if (isError) {
    return (
      <VStack space="md" className="py-4">
        <HStack className="items-center justify-between px-4">
          <Heading size="lg" className="text-typography-900">
            My Communities
          </Heading>
        </HStack>
        <Center className="py-8">
          <Text className="text-error-500">Failed to load communities</Text>
          <Text className="mt-1 text-xs text-typography-400">
            {error instanceof Error ? error.message : 'Unknown error'}
          </Text>
        </Center>
      </VStack>
    );
  }

  const communitiesData = communities?.body?.data || [];
  const allCommunitiesData = allCommunities?.body?.data || [];

  return (
    <VStack space="md" className="py-6">
      {/* Header */}
      <VStack space="xs" className="px-4">
        <Heading size="2xl" className="text-typography-900 dark:text-typography-900">
          {t('dashboard.communities.title')}
        </Heading>
        <Text className="text-sm text-typography-500 dark:text-typography-400">
          {t('dashboard.communities.subtitle')}
        </Text>
      </VStack>

      {/* Action Buttons */}
      <HStack space="sm" className="px-4">
        <Pressable
          onPress={() => setDiscoverModalVisible(true)}
          className="flex-1 items-center justify-center rounded-lg border-2 border-success-500 bg-background-0 px-4 py-3"
        >
          <HStack space="xs" className="items-center">
            <Users size={18} color="#10b981" />
            <Text className="text-sm font-semibold text-success-600">{t('dashboard.communities.discover')}</Text>
          </HStack>
        </Pressable>

        <Pressable
          onPress={() => setCreateModalVisible(true)}
          className="flex-1 items-center justify-center rounded-lg bg-background-0 px-4 py-3"
        >
          <Text className="text-sm font-semibold text-typography-900">{t('dashboard.communities.createNew')}</Text>
        </Pressable>
      </HStack>

      {/* My Communities List */}
      <VStack space="sm">
        <Heading size="md" className="px-4 text-typography-800">
          {t('dashboard.communities.title')}
        </Heading>
        {!communitiesData || communitiesData.length === 0 ? (
          <EmptyState
            message={t('dashboard.communities.empty.title')}
            subMessage={t('dashboard.communities.empty.subtitle')}
          />
        ) : (
          <CommunityGrid
            data={communitiesData}
            onPress={handleCommunityPress}
            onJoin={handleJoin}
            joiningId={joiningId}
          />
        )}
      </VStack>

      {/* All Communities List */}
      <VStack space="sm" className="mt-4">
        <Heading size="md" className="px-4 text-typography-800 dark:text-white">
          {t('dashboard.communities.allCommunities')}
        </Heading>
        {isAllLoading ? (
            <Center className="py-8">
              <Spinner size="large" />
              <Text className="mt-2 text-sm text-typography-500">Loading all communities...</Text>
            </Center>
        ) : !allCommunitiesData || allCommunitiesData.length === 0 ? (
          <EmptyState
             message={t('dashboard.communities.empty.allEmpty')}
             subMessage={t('dashboard.communities.empty.allEmptySubtitle')}
          />
        ) : (
          <CommunityGrid
            data={allCommunitiesData}
            onPress={handleCommunityPress}
            onJoin={handleJoin}
            joiningId={joiningId}
          />
        )}
      </VStack>

      {/* Modals */}
      <CreateCommunityModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
      />
      <DiscoverCommunitiesModal
        visible={discoverModalVisible}
        onClose={() => setDiscoverModalVisible(false)}
        onJoinPrivate={() => {
          setDiscoverModalVisible(false);
          setJoinWithCodeModalVisible(true);
        }}
      />
      <JoinWithCodeModal
        visible={joinWithCodeModalVisible}
        onClose={() => setJoinWithCodeModalVisible(false)}
      />
    </VStack>
  );
}
