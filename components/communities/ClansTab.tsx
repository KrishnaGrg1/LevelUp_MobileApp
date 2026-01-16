import { ClanOptionsModal } from '@/components/communities/ClanOptionsModal';
import { CreateClanModal } from '@/components/communities/CreateClanModal';
import { JoinPrivateClanModal } from '@/components/communities/JoinPrivateClanModal';
import { Box } from '@/components/ui/box';
import { Center } from '@/components/ui/center';
import { HStack } from '@/components/ui/hstack';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import {
  useAvailableClans,
  useJoinClan,
  useJoinClanWithCode,
  useJoinedClans,
} from '@/hooks/queries/useClan';
import { MoreVertical, Plus, Search, Shield, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, RefreshControl, ScrollView, TextInput } from 'react-native';

interface ClansTabProps {
  communityId: string;
  communityName?: string;
}

export function ClansTab({ communityId, communityName }: ClansTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClan, setSelectedClan] = useState<string | null>(null);
  const [showCreateClanModal, setShowCreateClanModal] = useState(false);
  const [showJoinPrivateClanModal, setShowJoinPrivateClanModal] = useState(false);
  const [selectedClanToJoin, setSelectedClanToJoin] = useState<{
    id: string;
    name: string;
    isPrivate: boolean;
  } | null>(null);
  const [showClanOptions, setShowClanOptions] = useState(false);
  const [selectedClanForOptions, setSelectedClanForOptions] = useState<{
    name: string;
    isMember: boolean;
  } | null>(null);

  // Fetch joined and available clans from API
  const {
    data: joinedClansData,
    isLoading: joinedLoading,
    error: joinedError,
    refetch: refetchJoined,
    isRefetching: isRefetchingJoined,
  } = useJoinedClans(communityId);

  const {
    data: availableClansData,
    isLoading: availableLoading,
    error: availableError,
    refetch: refetchAvailable,
    isRefetching: isRefetchingAvailable,
  } = useAvailableClans(communityId);

  // Debug logs
  console.log('Joined Clans Query:', {
    loading: joinedLoading,
    error: joinedError?.message,
    errorObj: joinedError,
    data: joinedClansData?.body?.data?.length,
    rawData: joinedClansData,
  });
  console.log('Available Clans Query:', {
    loading: availableLoading,
    error: availableError?.message,
    data: availableClansData?.body?.data?.length,
  });

  // If joined endpoint fails, treat it as empty array but log the error
  if (joinedError) {
    console.error('❌ Joined clans endpoint error:', joinedError);
  }

  // Join clan mutations
  const { mutate: joinPublicClan, isPending: isJoiningPublic } = useJoinClan();
  const { mutate: joinPrivateClan, isPending: isJoiningPrivate } = useJoinClanWithCode();

  const handleJoinClan = (clanId: string, clanName: string, isPrivate: boolean) => {
    if (isPrivate) {
      setSelectedClanToJoin({ id: clanId, name: clanName, isPrivate: true });
      setShowJoinPrivateClanModal(true);
    } else {
      joinPublicClan(clanId, {
        onSuccess: () => {
          console.log('Successfully joined clan');
        },
        onError: (error: any) => {
          console.error('Failed to join clan:', error);
        },
      });
    }
  };

  const handleJoinPrivateClanWithCode = (code: string, clanId: string) => {
    joinPrivateClan(
      { clanId, inviteCode: code },
      {
        onSuccess: () => {
          console.log('Successfully joined private clan');
          setShowJoinPrivateClanModal(false);
          setSelectedClanToJoin(null);
        },
        onError: (error: any) => {
          console.error('Failed to join private clan:', error);
        },
      },
    );
  };

  const handleRefresh = async () => {
    await Promise.all([refetchJoined(), refetchAvailable()]);
  };
  const joinedClans = joinedClansData?.body?.data || [];

  const availableClans = availableClansData?.body?.data || [];

  const isLoading = joinedLoading || availableLoading;
  const isRefreshing = isRefetchingJoined || isRefetchingAvailable;
  const error = joinedError || availableError;

  // Filter clans by search
  const filteredJoinedClans = joinedClans.filter(clan =>
    clan?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const filteredAvailableClans = availableClans.filter(clan =>
    clan?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <VStack className="flex-1">
      {/* Header with Create Clan Button */}
      <HStack className="items-center justify-between border-b border-outline-200 bg-gradient-to-r from-purple-50 to-primary-50 px-4 py-4">
        <VStack space="xs">
          <Text className="text-base font-bold text-typography-900">Community Clans</Text>
          <Text className="text-xs text-typography-500">
            Join or create a clan to compete together
          </Text>
        </VStack>
        <Pressable
          className="flex-row items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 shadow-sm"
          onPress={() => setShowCreateClanModal(true)}
        >
          <Plus size={18} color="#ffffff" />
          <Text className="text-sm font-semibold text-white">Create</Text>
        </Pressable>
      </HStack>

      {/* Search Bar */}
      <Box className="border-b border-outline-200 bg-background-0 px-4 py-3">
        <HStack
          space="md"
          className="items-center rounded-xl border border-outline-300 bg-background-50 px-4 py-3 shadow-sm"
        >
          <Search size={20} color="#8b5cf6" />
          <TextInput
            placeholder="Search clans by name..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
            className="flex-1 text-sm text-typography-900"
          />
        </HStack>
      </Box>

      {/* Loading State */}
      {isLoading ? (
        <Center className="flex-1">
          <Spinner size="large" />
          <Text className="mt-4 text-sm text-typography-500">Loading clans...</Text>
        </Center>
      ) : error ? (
        <Center className="flex-1 px-4">
          <Text className="text-center text-error-500">Failed to load clans</Text>
        </Center>
      ) : (
        /* Clans List with Separate Sections */
        <ScrollView
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={['#8b5cf6']}
              tintColor="#8b5cf6"
            />
          }
        >
          {/* Joined Clans Section */}
          {filteredJoinedClans.length > 0 && (
            <VStack className="mt-2">
              <HStack className="items-center bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3">
                <Box className="mr-2 h-5 w-1 rounded-full bg-green-500" />
                <Text className="text-sm font-bold text-typography-900">Your Clans</Text>
                <Box className="ml-2 rounded-full bg-green-500 px-2 py-0.5">
                  <Text className="text-xs font-semibold text-white">
                    {filteredJoinedClans.length}
                  </Text>
                </Box>
              </HStack>
              {filteredJoinedClans.map(clan => (
                <Pressable
                  key={clan.id}
                  onPress={() => setSelectedClan(clan.id)}
                  className={`mx-4 mb-3 rounded-xl border shadow-sm ${
                    selectedClan === clan.id
                      ? 'border-primary-400 bg-gradient-to-br from-primary-50 to-purple-50'
                      : 'border-outline-200 bg-white'
                  }`}
                >
                  <HStack space="md" className="items-center px-4 py-4">
                    <Box
                      className={`h-14 w-14 items-center justify-center rounded-xl shadow-md ${
                        selectedClan === clan.id
                          ? 'bg-primary-500'
                          : 'bg-gradient-to-br from-purple-100 to-primary-100'
                      }`}
                    >
                      <Text className="text-3xl">{clan.isPrivate ? '🔒' : '⚔️'}</Text>
                    </Box>
                    <VStack className="flex-1" space="xs">
                      <Text className="text-base font-bold text-typography-900">{clan.name}</Text>
                      <HStack space="xs" className="items-center">
                        <Users size={14} color="#059669" />
                        <Text className="text-xs font-medium text-green-700">
                          {clan.stats?.memberCount || 0} / {clan.limit} members
                        </Text>
                      </HStack>
                    </VStack>
                    <HStack space="xs" className="items-center">
                      <Box className="rounded-full bg-green-100 px-3 py-1.5">
                        <Text className="text-xs font-semibold text-green-700">Active</Text>
                      </Box>
                      <Pressable
                        onPress={e => {
                          e.stopPropagation();
                          setSelectedClanForOptions({ name: clan.name, isMember: true });
                          setShowClanOptions(true);
                        }}
                        className="p-1"
                      >
                        <MoreVertical size={18} color="#6b7280" />
                      </Pressable>
                    </HStack>
                  </HStack>
                </Pressable>
              ))}
            </VStack>
          )}

          {/* Available Clans Section */}
          {filteredAvailableClans.length > 0 && (
            <VStack className="mt-4">
              <HStack className="items-center bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-3">
                <Box className="mr-2 h-5 w-1 rounded-full bg-blue-500" />
                <Text className="text-sm font-bold text-typography-900">Available to Join</Text>
                <Box className="ml-2 rounded-full bg-blue-500 px-2 py-0.5">
                  <Text className="text-xs font-semibold text-white">
                    {filteredAvailableClans.length}
                  </Text>
                </Box>
              </HStack>
              {filteredAvailableClans.map(clan => (
                <Pressable
                  key={clan.id}
                  onPress={() => setSelectedClan(clan.id)}
                  className={`mx-4 mb-3 rounded-xl border shadow-sm ${
                    selectedClan === clan.id
                      ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-cyan-50'
                      : 'border-outline-200 bg-white'
                  }`}
                >
                  <HStack space="md" className="items-center px-4 py-4">
                    <Box
                      className={`h-14 w-14 items-center justify-center rounded-xl shadow-md ${
                        selectedClan === clan.id
                          ? 'bg-blue-500'
                          : 'bg-gradient-to-br from-blue-100 to-cyan-100'
                      }`}
                    >
                      <Text className="text-3xl">{clan.isPrivate ? '🔒' : '⚔️'}</Text>
                    </Box>
                    <VStack className="flex-1" space="xs">
                      <Text className="text-base font-bold text-typography-900">{clan.name}</Text>
                      <HStack space="xs" className="items-center">
                        <Users size={14} color="#3b82f6" />
                        <Text className="text-xs font-medium text-blue-700">
                          {clan.stats?.memberCount || 0} / {clan.limit} members
                        </Text>
                      </HStack>
                    </VStack>
                    <HStack space="xs" className="items-center">
                      <Pressable
                        onPress={e => {
                          e.stopPropagation();
                          handleJoinClan(clan.id, clan.name, clan.isPrivate);
                        }}
                        disabled={isJoiningPublic || isJoiningPrivate}
                        className="rounded-xl bg-primary-600 px-5 py-2.5 shadow-sm"
                      >
                        <Text className="text-sm font-bold text-white">
                          {isJoiningPublic || isJoiningPrivate ? 'Joining...' : 'Join'}
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={e => {
                          e.stopPropagation();
                          setSelectedClanForOptions({ name: clan.name, isMember: false });
                          setShowClanOptions(true);
                        }}
                        className="p-1"
                      >
                        <MoreVertical size={18} color="#6b7280" />
                      </Pressable>
                    </HStack>
                  </HStack>
                </Pressable>
              ))}
            </VStack>
          )}

          {/* Empty State */}
          {filteredJoinedClans.length === 0 && filteredAvailableClans.length === 0 && (
            <Center className="px-8 py-20">
              <Box className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-primary-100">
                <Shield size={40} color="#8b5cf6" />
              </Box>
              <Text className="mb-2 text-lg font-bold text-typography-900">No Clans Found</Text>
              <Text className="mb-6 text-center text-typography-500">
                Be the first to create a clan in this community!
              </Text>
              <Pressable
                className="rounded-xl bg-primary-600 px-6 py-3 shadow-md"
                onPress={() => setShowCreateClanModal(true)}
              >
                <HStack space="xs" className="items-center">
                  <Plus size={20} color="#ffffff" />
                  <Text className="font-semibold text-white">Create First Clan</Text>
                </HStack>
              </Pressable>
            </Center>
          )}
        </ScrollView>
      )}

      {/* Create Clan Modal */}
      <CreateClanModal
        visible={showCreateClanModal}
        onClose={() => setShowCreateClanModal(false)}
        communityId={communityId}
      />

      {/* Join Private Clan Modal */}
      <JoinPrivateClanModal
        visible={showJoinPrivateClanModal}
        onClose={() => {
          setShowJoinPrivateClanModal(false);
          setSelectedClanToJoin(null);
        }}
        onJoin={handleJoinPrivateClanWithCode}
        isLoading={isJoiningPrivate}
        clanId={selectedClanToJoin?.id}
        clanName={selectedClanToJoin?.name}
        communityName={communityName}
      />

      {/* Clan Options Modal */}
      <ClanOptionsModal
        visible={showClanOptions}
        onClose={() => {
          setShowClanOptions(false);
          setSelectedClanForOptions(null);
        }}
        clanName={selectedClanForOptions?.name}
        isMember={selectedClanForOptions?.isMember}
      />
    </VStack>
  );
}
