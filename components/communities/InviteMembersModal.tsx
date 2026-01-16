import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useGetInviteCode, useRegenerateInviteCode } from '@/hooks/queries/useCommunities';
import * as Clipboard from 'expo-clipboard';
import { Check, Copy, RefreshCw, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Modal, Pressable } from 'react-native';

interface InviteMembersModalProps {
  visible: boolean;
  onClose: () => void;
  communityId: string;
  communityName?: string;
  isOwner?: boolean;
}

export const InviteMembersModal: React.FC<InviteMembersModalProps> = ({
  visible,
  onClose,
  communityId,
  communityName,
  isOwner = false,
}) => {
  const [copied, setCopied] = useState(false);
  const { data, isLoading, error } = useGetInviteCode(communityId, visible);
  const { mutate: regenerateCode, isPending: isRegenerating } = useRegenerateInviteCode();

  const inviteCode = data?.body?.data?.inviteCode;
  const description = data?.body?.data?.description;

  const handleCopy = async () => {
    if (inviteCode) {
      await Clipboard.setStringAsync(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRegenerateCode = () => {
    Alert.alert(
      'Regenerate Invite Code',
      'Are you sure you want to regenerate the invite code? The old code will no longer work.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Regenerate',
          style: 'destructive',
          onPress: () => {
            regenerateCode(communityId, {
              onSuccess: () => {
                Alert.alert('Success', 'Invite code has been regenerated successfully');
              },
              onError: (error: any) => {
                const errorMessage =
                  error?.message || 'Failed to regenerate invite code. Please try again.';
                Alert.alert('Error', errorMessage);
              },
            });
          },
        },
      ],
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable className="flex-1 items-center justify-center bg-black/50 px-4" onPress={onClose}>
        <Pressable
          className="w-full max-w-md rounded-2xl bg-white p-6"
          onPress={e => e.stopPropagation()}
        >
          <VStack space="lg">
            {/* Header */}
            <HStack className="items-center justify-between">
              <Heading size="lg" className="text-typography-900">
                Invite Members
              </Heading>
              <Pressable onPress={onClose} className="p-1">
                <X size={24} color="#6b7280" />
              </Pressable>
            </HStack>

            {/* Content */}
            {isLoading ? (
              <VStack space="md" className="items-center py-8">
                <Spinner size="large" />
                <Text className="text-typography-500">Loading invite code...</Text>
              </VStack>
            ) : error ? (
              <VStack space="md" className="items-center py-8">
                <Text className="text-center text-error-500">
                  {error instanceof Error ? error.message : 'Failed to load invite code'}
                </Text>
              </VStack>
            ) : (
              <>
                {/* Community Name */}
                <VStack space="xs">
                  <Text className="text-sm font-medium text-typography-700">Community</Text>
                  <Text className="text-base text-typography-900">
                    {communityName || 'Community'}
                  </Text>
                </VStack>

                {/* Description */}
                {description && (
                  <VStack space="xs">
                    <Text className="text-sm font-medium text-typography-700">Description</Text>
                    <Text className="text-sm text-typography-600">{description}</Text>
                  </VStack>
                )}

                {/* Invite Code */}
                <VStack space="xs">
                  <Text className="text-sm font-medium text-typography-700">Invite Code</Text>
                  <HStack space="sm" className="items-center">
                    <Box className="flex-1 rounded-lg border border-outline-300 bg-background-50 px-4 py-3">
                      <Text className="font-mono text-center text-lg font-semibold text-primary-600">
                        {inviteCode}
                      </Text>
                    </Box>
                    <Pressable
                      onPress={handleCopy}
                      className="h-12 w-12 items-center justify-center rounded-lg bg-primary-100 active:bg-primary-200"
                    >
                      {copied ? (
                        <Check size={20} color="#10b981" />
                      ) : (
                        <Copy size={20} color="#8b5cf6" />
                      )}
                    </Pressable>
                  </HStack>
                  {copied && <Text className="text-xs text-success-600">Copied to clipboard!</Text>}
                </VStack>

                {/* Regenerate Button (Owner Only) */}
                {isOwner && (
                  <Button
                    onPress={handleRegenerateCode}
                    disabled={isRegenerating}
                    variant="outline"
                    className="rounded-lg border-amber-300 bg-amber-50"
                  >
                    <HStack space="xs" className="items-center">
                      <RefreshCw size={16} color="#f59e0b" />
                      <ButtonText className="text-amber-600">
                        {isRegenerating ? 'Regenerating...' : 'Regenerate Code'}
                      </ButtonText>
                    </HStack>
                  </Button>
                )}

                {/* Instructions */}
                <Box className="rounded-lg bg-primary-50 p-3">
                  <Text className="text-xs text-typography-700">
                    Share this invite code with others to let them join your community. They can
                    enter it in the "Join With Code " option.
                  </Text>
                </Box>

                {/* Actions */}
                <HStack space="md" className="mt-2">
                  <Button
                    onPress={onClose}
                    variant="outline"
                    className="flex-1 rounded-lg border-outline-300"
                  >
                    <ButtonText className="text-typography-700">Close</ButtonText>
                  </Button>
                </HStack>
              </>
            )}
          </VStack>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
