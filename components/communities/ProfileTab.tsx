import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Shield, Users } from 'lucide-react-native';
import React from 'react';
import { Image, Pressable, ScrollView } from 'react-native';

interface ProfileTabProps {
  community: {
    id: string;
    name: string;
    description?: string;
    photo?: string;
    isPrivate: boolean;
    memberLimit: number;
    ownerId: string;
    owner?: {
      UserName: string;
    };
    members?: Array<{
      user: {
        UserName: string;
      };
      joinedAt: string;
    }>;
    clans?: Array<{
      id: string;
      name: string;
      isPrivate: boolean;
      createdAt: string;
      owner: {
        UserName: string;
      };
      _count: {
        members: number;
      };
    }>;
    _count?: {
      members: number;
      clans: number;
    };
  };
  onViewAllClans: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ community, onViewAllClans }) => {
  return (
    <ScrollView className="flex-1 bg-background-0" showsVerticalScrollIndicator={false}>
      <VStack className="p-4" space="lg">
        {/* Community Photo & Name */}
        <VStack
          space="md"
          className="items-center rounded-2xl bg-gradient-to-b from-primary-100 to-background-0 p-6"
        >
          {community.photo ? (
            <Box className="h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-lg">
              <Image
                source={{ uri: community.photo }}
                style={{ width: 88, height: 88 }}
                resizeMode="cover"
              />
            </Box>
          ) : (
            <Box className="h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-primary-500 shadow-lg">
              <Text className="text-5xl">🛡️</Text>
            </Box>
          )}
          <VStack space="xs" className="items-center">
            <Heading size="2xl" className="text-center text-typography-900">
              {community.name}
            </Heading>
            <HStack space="xs" className="items-center">
              <Box className="rounded-full bg-primary-500 px-3 py-1">
                <Text className="text-xs font-semibold text-white">
                  {community.isPrivate ? '🔒 Private' : '🌐 Public'}
                </Text>
              </Box>
            </HStack>
          </VStack>
        </VStack>

        {/* Description */}
        {community.description && (
          <Box className="rounded-xl border border-outline-200 bg-background-50 p-4">
            <VStack space="xs">
              <Text className="text-sm font-semibold text-typography-700">About</Text>
              <Text className="text-sm leading-5 text-typography-600">{community.description}</Text>
            </VStack>
          </Box>
        )}

        {/* Stats Cards */}
        <HStack space="md" className="flex-wrap">
          <Box className="min-w-[45%] flex-1 rounded-xl border border-outline-200 bg-gradient-to-br from-blue-50 to-background-0 p-4">
            <VStack space="xs" className="items-center">
              <Users size={24} color="#3b82f6" />
              <Text className="text-2xl font-bold text-typography-900">
                {community._count?.members || 0}
              </Text>
              <Text className="text-xs text-typography-500">Members</Text>
              <Text className="text-[10px] text-typography-400">
                Limit: {community.memberLimit || 'Unlimited'}
              </Text>
            </VStack>
          </Box>
          <Box className="min-w-[45%] flex-1 rounded-xl border border-outline-200 bg-gradient-to-br from-purple-50 to-background-0 p-4">
            <VStack space="xs" className="items-center">
              <Shield size={24} color="#8b5cf6" />
              <Text className="text-2xl font-bold text-typography-900">
                {community._count?.clans || 0}
              </Text>
              <Text className="text-xs text-typography-500">Clans</Text>
              <Text className="text-[10px] text-typography-400">Active</Text>
            </VStack>
          </Box>
        </HStack>

        {/* Owner Info */}
        <Box className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-background-0 p-4">
          <HStack space="md" className="items-center">
            <Box className="h-12 w-12 items-center justify-center rounded-full bg-amber-500">
              <Text className="text-xl font-bold text-white">
                {community.owner?.UserName?.charAt(0).toUpperCase()}
              </Text>
            </Box>
            <VStack className="flex-1" space="xs">
              <Text className="text-xs font-medium text-amber-700">Community Owner</Text>
              <Text className="text-base font-semibold text-typography-900">
                {community.owner?.UserName || 'Unknown'}
              </Text>
            </VStack>
            <Box className="rounded-full bg-amber-500 p-2">
              <Text className="text-xl">👑</Text>
            </Box>
          </HStack>
        </Box>

        {/* Members List */}
        {community.members && community.members.length > 0 && (
          <Box className="rounded-xl border border-outline-200 bg-background-50 p-4">
            <VStack space="md">
              <HStack className="items-center justify-between">
                <Text className="text-sm font-semibold text-typography-700">Recent Members</Text>
                <Text className="text-xs text-typography-500">
                  {community.members.length} shown
                </Text>
              </HStack>
              <VStack space="xs">
                {community.members.slice(0, 5).map((member, index) => (
                  <HStack
                    key={index}
                    space="md"
                    className="items-center rounded-lg border border-outline-100 bg-white p-3"
                  >
                    <Box className="h-10 w-10 items-center justify-center rounded-full bg-primary-500">
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

        {/* Clans Preview */}
        {community.clans && community.clans.length > 0 && (
          <Box className="rounded-xl border border-outline-200 bg-background-50 p-4">
            <VStack space="md">
              <HStack className="items-center justify-between">
                <Text className="text-sm font-semibold text-typography-700">Community Clans</Text>
                <Pressable onPress={onViewAllClans}>
                  <Text className="text-xs font-medium text-primary-600">View All →</Text>
                </Pressable>
              </HStack>
              <VStack space="xs">
                {community.clans.slice(0, 3).map(clan => (
                  <HStack
                    key={clan.id}
                    space="md"
                    className="items-center rounded-lg border border-outline-100 bg-white p-3"
                  >
                    <Box className="h-10 w-10 items-center justify-center rounded-lg bg-purple-500">
                      <Text className="text-lg">⚔️</Text>
                    </Box>
                    <VStack className="flex-1" space="xs">
                      <Text className="text-sm font-medium text-typography-900">{clan.name}</Text>
                      <HStack space="xs" className="items-center">
                        <Text className="text-xs text-typography-500">
                          {clan._count?.members || 0} members
                        </Text>
                        <Text className="text-xs text-typography-400">•</Text>
                        <Text className="text-xs text-typography-500">
                          {clan.isPrivate ? '🔒 Private' : '🌐 Public'}
                        </Text>
                      </HStack>
                    </VStack>
                    <Text className="text-xs text-typography-400">by {clan.owner?.UserName}</Text>
                  </HStack>
                ))}
              </VStack>
            </VStack>
          </Box>
        )}
      </VStack>
    </ScrollView>
  );
};
