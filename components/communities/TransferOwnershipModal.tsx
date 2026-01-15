import { Box } from '@/components/ui/box';
import { Center } from '@/components/ui/center';
import { HStack } from '@/components/ui/hstack';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useCommunityMembers, useTransferOwnership } from '@/hooks/queries/useCommunities';
import { Crown, Search, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, FlatList, Modal, Pressable, TextInput } from 'react-native';

interface TransferOwnershipModalProps {
  visible: boolean;
  onClose: () => void;
  communityId: string;
  communityName?: string;
}

export const TransferOwnershipModal: React.FC<TransferOwnershipModalProps> = ({
  visible,
  onClose,
  communityId,
  communityName,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { data: membersData, isLoading } = useCommunityMembers(communityId);
  const { mutate: transferOwnership, isPending: isTransferring } = useTransferOwnership();

  const membersResponse = membersData?.body?.data;
  const members = Array.isArray(membersResponse) ? membersResponse : membersResponse?.members || [];
  
  const filteredMembers = members.filter((member: any) => {
    const userName = member?.userName || '';
    return userName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleTransfer = () => {
    if (!selectedUserId) return;

    const selectedMember = members.find((m: any) => m.userId === selectedUserId);
    if (!selectedMember) return;

    const userName = selectedMember?.userName || 'this user';

    Alert.alert(
      'Transfer Ownership',
      `Are you sure you want to transfer ownership to ${userName}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Transfer',
          style: 'destructive',
          onPress: () => {
            transferOwnership(
              { communityId, newOwnerId: selectedUserId },
              {
                onSuccess: () => {
                  Alert.alert('Success', 'Ownership transferred successfully');
                  onClose();
                  setSelectedUserId(null);
                  setSearchQuery('');
                },
                onError: (error: any) => {
                  const errorMessage = error?.message || 'Failed to transfer ownership';
                  Alert.alert('Error', errorMessage);
                },
              }
            );
          },
        },
      ]
    );
  };

  const handleClose = () => {
    setSelectedUserId(null);
    setSearchQuery('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <Pressable className="flex-1 items-center justify-center bg-black/50 px-4" onPress={handleClose}>
        <Pressable
          className="w-full max-w-md h-3/4 rounded-2xl bg-white overflow-hidden"
          onPress={(e) => e.stopPropagation()}
        >
          <VStack className="flex-1">
            {/* Header */}
            <Box className="px-6 py-4 border-b border-outline-200 bg-primary-50">
              <HStack space="md" className="items-center">
                <Crown size={24} color="#8b5cf6" />
                <VStack className="flex-1">
                  <Text className="text-lg font-bold text-typography-900">Transfer Ownership</Text>
                  {communityName && (
                    <Text className="text-sm text-typography-600">{communityName}</Text>
                  )}
                </VStack>
              </HStack>
            </Box>

            {/* Search Bar */}
            <Box className="px-4 py-3 border-b border-outline-200">
              <HStack
                space="md"
                className="bg-background-50 rounded-lg px-3 py-2 items-center border border-outline-200"
              >
                <Search size={18} color="#9ca3af" />
                <TextInput
                  placeholder="Search members..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor="#9ca3af"
                  className="flex-1 text-typography-900 text-sm"
                />
              </HStack>
            </Box>

            {/* Members List */}
            {isLoading ? (
              <Center className="flex-1">
                <Spinner size="large" />
                <Text className="mt-4 text-sm text-typography-500">Loading members...</Text>
              </Center>
            ) : (
              <FlatList
                data={filteredMembers}
                keyExtractor={(item) => item.userId}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => setSelectedUserId(item.userId)}
                    className={`mx-4 my-1 p-3 rounded-lg border ${
                      selectedUserId === item.userId
                        ? 'bg-primary-50 border-primary-500'
                        : 'bg-background-0 border-outline-200'
                    }`}
                  >
                    <HStack space="md" className="items-center">
                      <Box
                        className={`w-10 h-10 rounded-full items-center justify-center ${
                          selectedUserId === item.userId ? 'bg-primary-500' : 'bg-primary-100'
                        }`}
                      >
                        <User
                          size={20}
                          color={selectedUserId === item.userId ? '#ffffff' : '#8b5cf6'}
                        />
                      </Box>
                      <VStack className="flex-1">
                        <Text className="text-sm font-semibold text-typography-900">
                          {item?.userName || 'Unknown'}
                        </Text>
                        <Text className="text-xs text-typography-500">
                          Level {item?.level || 0} • {item?.xp || 0} XP
                        </Text>
                      </VStack>
                      {selectedUserId === item.userId && (
                        <Box className="w-6 h-6 rounded-full bg-primary-600 items-center justify-center">
                          <Text className="text-white text-xs">✓</Text>
                        </Box>
                      )}
                    </HStack>
                  </Pressable>
                )}
                ListEmptyComponent={
                  <Center className="py-20">
                    <User size={48} color="#d1d5db" />
                    <Text className="mt-4 text-typography-500">No members found</Text>
                  </Center>
                }
              />
            )}

            {/* Footer with Buttons */}
            <Box className="px-4 py-3 border-t border-outline-200 bg-background-50">
              <HStack space="md">
                <Pressable
                  onPress={handleClose}
                  className="flex-1 py-3 rounded-lg bg-background-200 active:bg-background-300"
                >
                  <Text className="text-center text-typography-900 font-semibold">Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={handleTransfer}
                  disabled={!selectedUserId || isTransferring}
                  className={`flex-1 py-3 rounded-lg ${
                    !selectedUserId || isTransferring ? 'bg-primary-300' : 'bg-primary-600'
                  }`}
                >
                  <Text className="text-center text-white font-semibold">
                    {isTransferring ? 'Transferring...' : 'Transfer Ownership'}
                  </Text>
                </Pressable>
              </HStack>
            </Box>
          </VStack>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
