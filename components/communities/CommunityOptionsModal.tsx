import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useLeaveCommunity } from '@/hooks/queries/useCommunities';
import { Bell, Crown, Info, LogOut, Settings, UserPlus, VolumeX } from 'lucide-react-native';
import React from 'react';
import { Alert, Modal, Pressable } from 'react-native';

interface CommunityOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onTransferOwnership?: () => void;
  communityName?: string;
  communityId?: string;
}

export const CommunityOptionsModal: React.FC<CommunityOptionsModalProps> = ({
  visible,
  onClose,
  onTransferOwnership,
  communityName,
  communityId,
}) => {
  const { mutate: leaveCommunity, isPending: isLeaving } = useLeaveCommunity();

  const options = [
    { id: 'info', label: 'Community Info', icon: Info, color: '#6b7280' },
    { id: 'settings', label: 'Settings', icon: Settings, color: '#6b7280' },
    {
      id: 'invite',
      label: 'Invite Members',
      icon: UserPlus,
      color: '#6b7280',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      color: '#6b7280',
    },
    { id: 'mute', label: 'Mute', icon: VolumeX, color: '#6b7280' },
    { id: 'transfer', label: 'Transfer Ownership', icon: Crown, color: '#f59e0b' },
    { id: 'leave', label: 'Leave Community', icon: LogOut, color: '#ef4444' },
  ];

  const handleOptionPress = (optionId: string) => {
    if (optionId === 'transfer' && communityId && onTransferOwnership) {
      onTransferOwnership();
    } else if (optionId === 'leave' && communityId) {
      // Show confirmation dialog
      Alert.alert(
        'Leave Community',
        `Are you sure you want to leave ${communityName || 'this community'}?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Leave',
            style: 'destructive',
            onPress: () => {
              leaveCommunity(communityId, {
                onSuccess: () => {
                  console.log('Successfully left community');
                  onClose();
                },
                onError: (error: any) => {
                  console.error('Failed to leave community:', error);
                  // Extract error message from backend response
                  const errorMessage = error?.message || 'Failed to leave community. Please try again.';
                  Alert.alert('Error', errorMessage);
                },
              });
            },
          },
        ],
      );
    } else {
      // Handle other options here
      console.log('Selected option:', optionId);
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <Pressable className="flex-1 items-center justify-center bg-black/50 px-4" onPress={onClose}>
        <Pressable
          className="w-full max-w-sm rounded-2xl bg-white"
          onPress={e => e.stopPropagation()}
        >
          <VStack className="py-2">
            {options.map((option, index) => (
              <Pressable
                key={option.id}
                onPress={() => handleOptionPress(option.id)}
                disabled={option.id === 'leave' && isLeaving}
                className="px-4 py-3 active:bg-gray-50"
              >
                <HStack space="md" className="items-center">
                  <Box className="h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                    <option.icon size={20} color={option.color} />
                  </Box>
                  <Text
                    className={`text-base ${
                      option.id === 'leave' 
                        ? 'font-semibold text-error-500' 
                        : option.id === 'transfer'
                        ? 'font-semibold text-amber-600'
                        : 'text-typography-900'
                    }`}
                  >
                    {option.id === 'leave' && isLeaving ? 'Leaving...' : option.label}
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
