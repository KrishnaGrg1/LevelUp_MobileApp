import { CommunityDTO } from '@/api/generated';
import { CreateCommunityModal } from '@/components/communities/CreateCommunityModal';
import { DiscoverCommunitiesModal } from '@/components/communities/DiscoverCommunitiesModal';
import { JoinPrivateCommunityModal } from '@/components/communities/JoinPrivateCommunityModal';
import { Avatar, AvatarFallbackText } from '@/components/ui/avatar';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Box } from '@/components/ui/box';
import { Center } from '@/components/ui/center';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useMyCommunities } from '@/hooks/queries/useCommunities';
import { useThemeStore } from '@/stores/theme.store';
import { useRouter } from 'expo-router';
import { ChevronRight, Lock, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, FlatList, Image, Pressable } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

interface CommunityCardProps {
  community: CommunityDTO;
  onPress: () => void;
}

function CommunityCard({ community, onPress }: CommunityCardProps) {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark' || (theme === 'system' && false);

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
              <Heading size="md" className="text-typography-900" numberOfLines={1}>
                {community.name}
              </Heading>
              {community.isPrivate && (
                <HStack space="xs" className="mt-1 items-center">
                  <Lock size={12} color="#8b5cf6" />
                  <Text className="text-xs text-primary-600">Private Community</Text>
                </HStack>
              )}
            </VStack>

            <ChevronRight size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
          </HStack>

          {/* Role Badge */}
          {community.userRole === 'ADMIN' && (
            <Badge size="sm" variant="solid" className="self-start bg-warning-500">
              <BadgeText>Admin</BadgeText>
            </Badge>
          )}

          {/* Member Count */}
          <HStack space="xs" className="items-center">
            <Users size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
            <Text className="text-sm text-typography-600">
              {community.currentMembers} / {community.maxMembers} members
            </Text>
          </HStack>

          {/* Description */}
          {community.description && (
            <Text className="text-sm text-typography-500" numberOfLines={2}>
              {community.description}
            </Text>
          )}
        </VStack>
      </Box>
    </Pressable>
  );
}

function EmptyState() {
  return (
    <Center className="px-4 py-12">
      <VStack space="md" className="items-center">
        <Box className="h-20 w-20 items-center justify-center rounded-full bg-primary-100">
          <Users size={40} color="#8b5cf6" strokeWidth={1.5} />
        </Box>
        <VStack space="xs" className="items-center">
          <Text className="text-center text-base font-semibold text-typography-700">
            No communities yet
          </Text>
          <Text className="text-center text-sm text-typography-500">
            Join or create a community to get started!
          </Text>
        </VStack>
      </VStack>
    </Center>
  );
}

export function CommunitiesSection() {
  const router = useRouter();
  const { data: communities, isLoading, isError, error } = useMyCommunities();

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [discoverModalVisible, setDiscoverModalVisible] = useState(false);
  const [joinPrivateModalVisible, setJoinPrivateModalVisible] = useState(false);

  React.useEffect(() => {
    console.log('Communities data:', communities);
    console.log('Is loading:', isLoading);
    console.log('Is error:', isError);
    if (error) console.log('Error:', error);
  }, [communities, isLoading, isError, error]);

  const handleCommunityPress = (communityId: string) => {
    router.push(`/communities/${communityId}` as any);
  };

  const handleViewAllPress = () => {
    router.push('/(main)/(tabs)/learn'); // Navigate to communities list
  };

  if (isLoading) {
    return (
      <VStack space="md" className="py-4">
        <HStack className="items-center justify-between px-4">
          <Heading size="lg" className="text-typography-900">
            My Communities
          </Heading>
        </HStack>
        <Center className="py-8">
          <Spinner size="large" />
          <Text className="mt-2 text-sm text-typography-500">Loading communities...</Text>
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

  return (
    <VStack space="md" className="py-6">
      {/* Header */}
      <VStack space="xs" className="px-4">
        <Heading size="2xl" className="text-typography-900">
          My Communities
        </Heading>
        <Text className="text-sm text-typography-500">
          Manage and explore your professional communities
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
            <Text className="text-sm font-semibold text-success-600">Join</Text>
          </HStack>
        </Pressable>

        <Pressable
          onPress={() => setCreateModalVisible(true)}
          className="flex-1 items-center justify-center rounded-lg bg-white px-4 py-3"
        >
          <Text className="text-sm font-semibold text-black">+ Create New Community</Text>
        </Pressable>
      </HStack>

      {/* Communities List */}
      {!communitiesData || communitiesData.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          horizontal
          data={communitiesData}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <CommunityCard community={item} onPress={() => handleCommunityPress(item.id)} />
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      )}

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
          setJoinPrivateModalVisible(true);
        }}
      />
      <JoinPrivateCommunityModal
        visible={joinPrivateModalVisible}
        onClose={() => setJoinPrivateModalVisible(false)}
      />
    </VStack>
  );
}
