import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useClanInfo, useLeaveClan } from '@/hooks/queries/useClan';
import authStore from '@/stores/auth.store';
import { Calendar, Info, LogOut, Shield, UserPlus, Users, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView } from 'react-native';

interface ClanOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  clanId?: string;
  clanName?: string;
  isMember?: boolean;
}

export const ClanOptionsModal: React.FC<ClanOptionsModalProps> = ({
  visible,
  onClose,
  clanId,
  clanName,
  isMember = false,
}) => {
  const [showClanInfo, setShowClanInfo] = useState(false);
  const { mutate: leaveClan, isPending: isLeaving } = useLeaveClan();
  const currentUserId = authStore.getState().user?.id;

  // Fetch clan info when showClanInfo is true and clanId exists
  const { data: clanData, isLoading: isLoadingClan } = useClanInfo(
    showClanInfo && clanId ? clanId : '',
  );

  const clan = clanData?.body?.data;
  const options = [
    { id: 'info', label: 'Clan Info', icon: Info, color: '#6b7280' },
    ...(isMember
      ? [
          { id: 'invite', label: 'Invite Members', icon: UserPlus, color: '#6b7280' },

          { id: 'leave', label: 'Leave Clan', icon: LogOut, color: '#ef4444' },
        ]
      : []),
  ];

  const handleOptionPress = (optionId: string) => {
    if (optionId === 'info') {
      setShowClanInfo(true);
      return;
    }

    if (optionId === 'leave' && clanId) {
      Alert.alert(
        'Leave Clan',
        `Are you sure you want to leave "${clanName}"? You will need to rejoin to access clan features again.`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Leave',
            style: 'destructive',
            onPress: () => {
              leaveClan(clanId, {
                onSuccess: () => {
                  Alert.alert('Success', `You have left ${clanName}`);
                  onClose();
                },
                onError: (error: any) => {
                  const errorMessage = error?.message || 'Failed to leave clan. Please try again.';
                  Alert.alert('Error', errorMessage);
                },
              });
            },
          },
        ],
      );
      return;
    }

    // Handle other options
    console.log('Selected option:', optionId);
    onClose();
  };

  // Render Clan Info View
  if (showClanInfo) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowClanInfo(false)}
      >
        <VStack className="flex-1 bg-background-0">
          {/* Header */}
          <HStack className="items-center justify-between border-b border-outline-200 bg-background-0 px-4 py-4">
            <Text className="text-lg font-semibold text-typography-900">Clan Info</Text>
            <Pressable onPress={() => setShowClanInfo(false)} className="p-2">
              <X size={24} color="#6b7280" />
            </Pressable>
          </HStack>

          {/* Content */}
          {isLoadingClan ? (
            <Box className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#8b5cf6" />
            </Box>
          ) : !clan ? (
            <Box className="flex-1 items-center justify-center p-4">
              <Text className="text-center text-error-500">Failed to load clan details</Text>
            </Box>
          ) : (
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              <VStack className="p-4" space="lg">
                {/* Clan Badge */}
                <VStack
                  space="md"
                  className="items-center rounded-2xl bg-gradient-to-b from-purple-100 to-background-0 p-6"
                >
                  <Box className="h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-purple-500 shadow-lg">
                    <Text className="text-5xl">⚔️</Text>
                  </Box>
                  <VStack space="xs" className="items-center">
                    <Text className="text-center text-2xl font-bold text-typography-900">
                      {clan.name}
                    </Text>
                    <HStack space="xs" className="items-center">
                      <Box className="rounded-full bg-purple-500 px-3 py-1">
                        <Text className="text-xs font-semibold text-white">
                          {clan.isPrivate ? '🔒 Private' : '🌐 Public'}
                        </Text>
                      </Box>
                    </HStack>
                  </VStack>
                </VStack>

                {/* Creation Date */}
                <Box className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-background-0 p-4">
                  <HStack space="md" className="items-center">
                    <Box className="h-10 w-10 items-center justify-center rounded-full bg-green-500">
                      <Calendar size={20} color="#ffffff" />
                    </Box>
                    <VStack className="flex-1" space="xs">
                      <Text className="text-xs font-medium text-green-700">Clan Created</Text>
                      <Text className="text-base font-semibold text-typography-900">
                        {new Date(clan.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>

                {/* Description */}
                {clan.description && (
                  <Box className="rounded-xl border border-outline-200 bg-background-50 p-4">
                    <VStack space="xs">
                      <Text className="text-sm font-semibold text-typography-700">About</Text>
                      <Text className="text-sm leading-5 text-typography-600">
                        {clan.description}
                      </Text>
                    </VStack>
                  </Box>
                )}

                {/* Welcome Message */}
                {clan.welcomeMessage && (
                  <Box className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-background-0 p-4">
                    <VStack space="xs">
                      <Text className="text-sm font-semibold text-blue-700">Welcome Message</Text>
                      <Text className="text-sm leading-5 text-typography-600">
                        {clan.welcomeMessage}
                      </Text>
                    </VStack>
                  </Box>
                )}

                {/* Stats Cards */}
                <HStack space="md" className="flex-wrap">
                  <Box className="min-w-[45%] flex-1 rounded-xl border border-outline-200 bg-gradient-to-br from-blue-50 to-background-0 p-4">
                    <VStack space="xs" className="items-center">
                      <Users size={24} color="#3b82f6" />
                      <Text className="text-2xl font-bold text-typography-900">
                        {clan._count?.members || 0}
                      </Text>
                      <Text className="text-xs text-typography-500">Members</Text>
                      <Text className="text-[10px] text-typography-400">
                        Limit: {clan.limit || 'Unlimited'}
                      </Text>
                    </VStack>
                  </Box>
                  <Box className="min-w-[45%] flex-1 rounded-xl border border-outline-200 bg-gradient-to-br from-amber-50 to-background-0 p-4">
                    <VStack space="xs" className="items-center">
                      <Shield size={24} color="#f59e0b" />
                      <Text className="text-2xl font-bold text-typography-900">{clan.xp || 0}</Text>
                      <Text className="text-xs text-typography-500">Total XP</Text>
                      <Text className="text-[10px] text-typography-400">
                        Wins: {clan.stats?.battlesWon || 0}
                      </Text>
                    </VStack>
                  </Box>
                </HStack>

                {/* Owner Info */}
                <Box className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-background-0 p-4">
                  <HStack space="md" className="items-center">
                    <Box className="h-12 w-12 items-center justify-center rounded-full bg-purple-500">
                      <Text className="text-xl font-bold text-white">
                        {clan.owner?.UserName?.charAt(0).toUpperCase()}
                      </Text>
                    </Box>
                    <VStack className="flex-1" space="xs">
                      <Text className="text-xs font-medium text-purple-700">Clan Leader</Text>
                      <Text className="text-base font-semibold text-typography-900">
                        {clan.owner?.UserName || 'Unknown'}
                      </Text>
                    </VStack>
                    <Box className="rounded-full bg-purple-500 p-2">
                      <Text className="text-xl">👑</Text>
                    </Box>
                  </HStack>
                </Box>

                {/* Community Info */}
                {clan.community && (
                  <Box className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-background-0 p-4">
                    <VStack space="xs">
                      <Text className="text-xs font-medium text-indigo-700">Part of Community</Text>
                      <HStack space="xs" className="items-center">
                        <Text className="text-base font-semibold text-typography-900">
                          {clan.community.name}
                        </Text>
                        <Text className="text-xs text-typography-500">
                          {clan.community.isPrivate ? '🔒' : '🌐'}
                        </Text>
                      </HStack>
                    </VStack>
                  </Box>
                )}

                {/* Members List */}
                {clan.members && clan.members.length > 0 && (
                  <Box className="rounded-xl border border-outline-200 bg-background-50 p-4">
                    <VStack space="md">
                      <HStack className="items-center justify-between">
                        <Text className="text-sm font-semibold text-typography-700">
                          Clan Members
                        </Text>
                        <Text className="text-xs text-typography-500">
                          {clan.members.length} total
                        </Text>
                      </HStack>
                      <VStack space="xs">
                        {clan.members.map((member: any, index: number) => (
                          <HStack
                            key={member.user?.id || index}
                            space="md"
                            className="items-center rounded-lg border border-outline-100 bg-white p-3"
                          >
                            <Box className="h-10 w-10 items-center justify-center rounded-full bg-purple-500">
                              <Text className="text-sm font-bold text-white">
                                {member.user?.UserName?.charAt(0).toUpperCase()}
                              </Text>
                            </Box>
                            <VStack className="flex-1" space="xs">
                              <Text className="text-sm font-medium text-typography-900">
                                {member.user?.UserName || 'Anonymous'}
                              </Text>
                              <Text className="text-xs text-typography-500">
                                Joined {new Date(member.joinedAt).toLocaleDateString()}
                              </Text>
                            </VStack>
                          </HStack>
                        ))}
                      </VStack>
                    </VStack>
                  </Box>
                )}
              </VStack>
            </ScrollView>
          )}
        </VStack>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <Pressable className="flex-1 items-center justify-center bg-black/50 px-4" onPress={onClose}>
        <Pressable
          className="w-full max-w-sm rounded-2xl bg-background-0"
          onPress={e => e.stopPropagation()}
        >
          <VStack className="py-2">
            {options.map((option, index) => (
              <Pressable
                key={option.id}
                onPress={() => handleOptionPress(option.id)}
                className="px-4 py-3 active:bg-background-50"
              >
                <HStack space="md" className="items-center">
                  <Box className="h-10 w-10 items-center justify-center rounded-full bg-background-100">
                    <option.icon size={20} color={option.color} />
                  </Box>
                  <Text
                    className={`text-base ${
                      option.id === 'leave' ? 'font-semibold text-error-500' : 'text-typography-900'
                    }`}
                  >
                    {option.label}
                  </Text>
                </HStack>
              </Pressable>
            ))}
          </VStack>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
