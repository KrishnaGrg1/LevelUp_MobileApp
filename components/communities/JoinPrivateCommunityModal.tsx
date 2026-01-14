import { Box } from '@/components/ui/box';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button'; // Added Spinner
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useJoinPrivateCommunity } from '@/hooks/queries/useCommunities'; // Import the hook
import { AlertCircle, X } from 'lucide-react-native';
import React from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable } from 'react-native';

interface JoinPrivateCommunityModalProps {
  visible: boolean;
  onClose: () => void;
}

export function JoinPrivateCommunityModal({ visible, onClose }: JoinPrivateCommunityModalProps) {
  const [inviteCode, setInviteCode] = React.useState('');

  // Initialize the mutation hook
  const { mutate: joinCommunity, isPending } = useJoinPrivateCommunity();

  const handleJoin = () => {
    if (inviteCode.length < 8) {
      console.log('Code too short');
      return;
    }

    joinCommunity(inviteCode.toUpperCase(), {
      onSuccess: () => {
        setInviteCode(''); // Clear input
        onClose(); // Close modal
        // You could add a success toast here
      },
      onError: (error: any) => {
        console.error('Failed to join:', error);
        // You could show an error message to the user here
      },
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <Box className="flex-1 bg-white">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <VStack className="flex-1">
            {/* Header */}
            <HStack className="items-center justify-between border-b border-outline-200 px-6 pb-4 pt-12">
              <Heading size="2xl" className="text-typography-900">
                Join Private Community
              </Heading>
              <Pressable onPress={onClose}>
                <X size={24} color="#374151" />
              </Pressable>
            </HStack>

            {/* Content */}
            <VStack className="mt-8 flex-1 px-6" space="lg">
              <HStack space="sm" className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <AlertCircle size={20} color="#3b82f6" />
                <VStack className="flex-1">
                  <Text className="text-sm font-semibold text-blue-900">
                    Invitation Code Required
                  </Text>
                  <Text className="mt-1 text-xs text-blue-700">
                    Private communities require an invitation code from an admin or member
                  </Text>
                </VStack>
              </HStack>

              <VStack space="xs">
                <Text className="text-sm font-medium text-typography-700">
                  Invite Code <Text className="text-error-500">*</Text>
                </Text>
                <Input variant="outline" size="lg" className="border-outline-300">
                  <InputField
                    placeholder="Enter 8-digit code"
                    value={inviteCode}
                    onChangeText={setInviteCode}
                    placeholderTextColor="#9ca3af"
                    maxLength={8}
                    autoCapitalize="characters"
                    // Disable input while loading
                    editable={!isPending}
                  />
                </Input>
                <Text className="text-xs text-typography-500">Example: ABCD1234</Text>
              </VStack>
            </VStack>

            {/* Footer Buttons */}
            <HStack space="md" className="border-t border-outline-200 px-6 pb-8 pt-4">
              <Button
                size="lg"
                variant="outline"
                onPress={onClose}
                className="flex-1 border-outline-300"
                isDisabled={isPending}
              >
                <ButtonText className="text-typography-700">Cancel</ButtonText>
              </Button>

              <Button
                size="lg"
                className="flex-1 bg-primary-500"
                onPress={handleJoin}
                isDisabled={isPending || inviteCode.length < 8}
              >
                {isPending && <ButtonSpinner className="mr-2" />}
                <ButtonText>Join Community</ButtonText>
              </Button>
            </HStack>
          </VStack>
        </KeyboardAvoidingView>
      </Box>
    </Modal>
  );
}
