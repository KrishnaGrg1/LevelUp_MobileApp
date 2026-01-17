import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { VStack } from '@/components/ui/vstack';
import { useUpdateCommunity } from '@/hooks/queries/useCommunities';
import { X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView } from 'react-native';

interface EditCommunityModalProps {
  visible: boolean;
  onClose: () => void;
  community: {
    id: string;
    name: string;
    description?: string;
    isPrivate: boolean;
    memberLimit: number;
  };
}

export const EditCommunityModal: React.FC<EditCommunityModalProps> = ({
  visible,
  onClose,
  community,
}) => {
  const [name, setName] = useState(community.name);
  const [description, setDescription] = useState(community.description || '');
  const [isPrivate, setIsPrivate] = useState(community.isPrivate);
  const [memberLimit, setMemberLimit] = useState(community.memberLimit.toString());

  const { mutate: updateCommunity, isPending } = useUpdateCommunity();

  useEffect(() => {
    if (visible) {
      setName(community.name);
      setDescription(community.description || '');
      setIsPrivate(community.isPrivate);
      setMemberLimit(community.memberLimit.toString());
    }
  }, [visible, community]);

  const handleUpdate = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Community name is required');
      return;
    }

    if (name.trim().length < 3) {
      Alert.alert('Error', 'Community name must be at least 3 characters');
      return;
    }

    if (name.trim().length > 150) {
      Alert.alert('Error', 'Community name must not exceed 150 characters');
      return;
    }

    const limitNumber = parseInt(memberLimit);
    if (isNaN(limitNumber) || limitNumber < 1 || limitNumber > 1000) {
      Alert.alert('Error', 'Member limit must be between 1 and 1000');
      return;
    }

    updateCommunity(
      {
        id: community.id,
        payload: {
          communityName: name.trim(),
          description: description.trim() || undefined,
          isPrivate,
          memberLimit: limitNumber,
        },
      },
      {
        onSuccess: () => {
          Alert.alert('Success', 'Community updated successfully');
          onClose();
        },
        onError: (error: any) => {
          const errorMessage = error?.message || 'Failed to update community. Please try again.';
          Alert.alert('Error', errorMessage);
        },
      },
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable className="flex-1 items-center justify-center bg-black/50 px-4" onPress={onClose}>
        <Pressable
          className="w-full max-w-md rounded-2xl bg-white"
          onPress={e => e.stopPropagation()}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <VStack className="p-6" space="lg">
              {/* Header */}
              <HStack className="items-center justify-between">
                <Heading size="lg" className="text-typography-900">
                  Edit Community
                </Heading>
                <Pressable onPress={onClose} className="p-1">
                  <X size={24} color="#6b7280" />
                </Pressable>
              </HStack>

              {/* Community Name */}
              <VStack space="xs">
                <Text className="text-sm font-medium text-typography-700">Community Name *</Text>
                <Input variant="outline" size="md" className="border-outline-300">
                  <InputField
                    placeholder="Enter community name"
                    value={name}
                    onChangeText={setName}
                    maxLength={150}
                  />
                </Input>
                <Text className="text-xs text-typography-500">{name.length}/150 characters</Text>
              </VStack>

              {/* Description */}
              <VStack space="xs">
                <Text className="text-sm font-medium text-typography-700">Description</Text>
                <Textarea size="md" className="border-outline-300">
                  <TextareaInput
                    placeholder="Describe your community..."
                    value={description}
                    onChangeText={setDescription}
                    maxLength={500}
                    numberOfLines={4}
                  />
                </Textarea>
                <Text className="text-xs text-typography-500">
                  {description.length}/500 characters
                </Text>
              </VStack>

              {/* Privacy Setting */}
              <HStack className="items-center justify-between rounded-lg border border-outline-200 bg-background-50 p-4">
                <VStack className="flex-1" space="xs">
                  <Text className="text-sm font-semibold text-typography-900">
                    Private Community
                  </Text>
                  <Text className="text-xs text-typography-600">
                    {isPrivate
                      ? 'Requires approval or invite code to join'
                      : 'Anyone can join freely'}
                  </Text>
                </VStack>
                <Switch value={isPrivate} onValueChange={setIsPrivate} />
              </HStack>

              {/* Member Limit */}
              <VStack space="xs">
                <Text className="text-sm font-medium text-typography-700">Member Limit</Text>
                <Input variant="outline" size="md" className="border-outline-300">
                  <InputField
                    placeholder="e.g., 100"
                    value={memberLimit}
                    onChangeText={setMemberLimit}
                    keyboardType="number-pad"
                    maxLength={4}
                  />
                </Input>
                <Text className="text-xs text-typography-500">
                  Set the maximum number of members (1-1000)
                </Text>
              </VStack>

              {/* Action Buttons */}
              <HStack space="md" className="mt-4">
                <Button
                  onPress={onClose}
                  variant="outline"
                  className="flex-1 rounded-lg border-outline-300"
                  disabled={isPending}
                >
                  <ButtonText className="text-typography-700">Cancel</ButtonText>
                </Button>
                <Button
                  onPress={handleUpdate}
                  className="flex-1 rounded-lg bg-primary-600"
                  disabled={isPending}
                >
                  <ButtonText className="text-white">
                    {isPending ? 'Updating...' : 'Update'}
                  </ButtonText>
                </Button>
              </HStack>
            </VStack>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
