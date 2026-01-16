import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Info, LogOut, UserPlus } from 'lucide-react-native';
import React from 'react';
import { Modal, Pressable } from 'react-native';

interface ClanOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  clanName?: string;
  isMember?: boolean;
}

export const ClanOptionsModal: React.FC<ClanOptionsModalProps> = ({
  visible,
  onClose,
  clanName,
  isMember = false,
}) => {
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
    // Handle option selection here
    console.log('Selected option:', optionId);
    onClose();
  };

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
