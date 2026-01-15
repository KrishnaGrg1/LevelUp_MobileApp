import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { AlertCircle, X } from 'lucide-react-native';
import React from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable } from 'react-native';

interface JoinPrivateClanModalProps {
  visible: boolean;
  onClose: () => void;
  onJoin: (code: string, clanId: string) => void;
  isLoading?: boolean;
  clanId?: string;
  clanName?: string;
  communityName?: string;
}

export function JoinPrivateClanModal({
  visible,
  onClose,
  onJoin,
  isLoading = false,
  clanId,
  clanName,
  communityName,
}: JoinPrivateClanModalProps) {
  const [inviteCode, setInviteCode] = React.useState('');

  // Debug logging
  React.useEffect(() => {
    if (visible) {
      console.log('JoinPrivateClanModal opened with:', { clanName, communityName });
    }
  }, [visible, clanName, communityName]);

  const handleJoin = () => {
    if (inviteCode.length < 8) {
      console.log('Code too short');
      return;
    }
    if (!clanId) {
      console.error('Clan ID is missing');
      return;
    }
    onJoin(inviteCode.toUpperCase(), clanId);
    setInviteCode('');
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <Pressable className="flex-1 items-center justify-center bg-black/50 px-4" onPress={onClose}>
        <Pressable
          className="w-full max-w-md rounded-2xl bg-background-0"
          onPress={e => e.stopPropagation()}
        >
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <VStack className="p-6" space="lg">
              {/* Header */}
              <VStack space="md">
                <HStack className="items-start justify-between">
                  <VStack space="xs" className="flex-1">
                    <Heading size="xl" className="font-bold text-primary-600">
                      Join Private Clan 🔒
                    </Heading>
                  </VStack>
                  <Pressable onPress={onClose} className="rounded-full bg-background-100 p-2">
                    <X size={18} color="#93a7cf" />
                  </Pressable>
                </HStack>
                <VStack space="xs" className="rounded-lg bg-primary-50 border border-primary-200 p-3">
                  {clanName ? (
                    <HStack space="xs" className="items-center">
                      <Text className="text-xs font-medium text-typography-500">Clan:</Text>
                      <Text className="text-sm font-bold text-primary-700">
                        {clanName}
                      </Text>
                    </HStack>
                  ) : null}
                  {communityName ? (
                    <HStack space="xs" className="items-center">
                      <Text className="text-xs font-medium text-typography-500">Community:</Text>
                      <Text className="text-sm font-semibold text-typography-700">
                        {communityName}
                      </Text>
                    </HStack>
                  ) : null}
                </VStack>
              </VStack>

              {/* Info Alert */}
              <HStack space="sm" className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                <AlertCircle size={18} color="#3b82f6" />
                <VStack className="flex-1">
                  <Text className="text-xs font-semibold text-blue-900">
                    Invitation Code Required
                  </Text>
                  <Text className="mt-1 text-xs text-blue-700">
                    Private clans require an invitation code from an admin or member
                  </Text>
                </VStack>
              </HStack>

              {/* Input */}
              <VStack space="xs">
                <Text className="text-sm font-medium text-typography-700">
                  Invite Code <Text className="text-error-500">*</Text>
                </Text>
                <Input variant="outline" size="md" className="border-outline-300">
                  <InputField
                    placeholder="Enter 8-digit code"
                    value={inviteCode}
                    onChangeText={setInviteCode}
                    placeholderTextColor="#9ca3af"
                    maxLength={8}
                    autoCapitalize="characters"
                    editable={!isLoading}
                  />
                </Input>
                <Text className="text-xs text-typography-500">Example: ABCD1234</Text>
              </VStack>

              {/* Footer Buttons */}
              <HStack space="md" className="mt-2">
                <Button
                  size="md"
                  variant="outline"
                  onPress={onClose}
                  className="flex-1 border-outline-300"
                  isDisabled={isLoading}
                >
                  <ButtonText className="text-typography-700">Cancel</ButtonText>
                </Button>

                <Button
                  size="md"
                  className="flex-1 bg-primary-600"
                  onPress={handleJoin}
                  isDisabled={isLoading || inviteCode.length < 8}
                >
                  {isLoading && <ButtonSpinner className="mr-2" />}
                  <ButtonText>Join Clan</ButtonText>
                </Button>
              </HStack>
            </VStack>
          </KeyboardAvoidingView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
