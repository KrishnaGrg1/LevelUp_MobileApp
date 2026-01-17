import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
} from '@/components/ui/actionsheet';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
} from '@/components/ui/modal';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import {
  useDeleteCommunity,
  useRemoveMember,
  useUploadCommunityPhoto,
} from '@/hooks/queries/useCommunities';
import authStore from '@/stores/auth.store';
import * as ImagePicker from 'expo-image-picker';
import {
  Calendar,
  Edit,
  Eye,
  Shield,
  Trash2,
  Upload,
  UserMinus,
  Users,
  X,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, Pressable, ScrollView } from 'react-native';
import { EditCommunityModal } from './EditCommunityModal';

interface ProfileTabProps {
  community: {
    id: string;
    name: string;
    description?: string;
    photo?: string;
    isPrivate: boolean;
    memberLimit: number;
    ownerId: string;
    createdAt: string;
    owner?: {
      UserName: string;
    };
    members?: Array<{
      user: {
        id: string;
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
  onDelete?: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ community, onViewAllClans, onDelete }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPhotoActionSheet, setShowPhotoActionSheet] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const { mutate: deleteCommunity, isPending: isDeleting } = useDeleteCommunity();
  const { mutate: removeMember, isPending: isRemoving } = useRemoveMember();
  const { mutate: uploadPhoto, isPending: isUploading } = useUploadCommunityPhoto();
  const currentUserId = authStore.getState().user?.id;
  const isOwner = community.ownerId === currentUserId;

  const handleDelete = () => {
    Alert.alert(
      'Confirm Deletion',
      `You are about to delete "${community.name}".\n\nThis will permanently remove all members, clans, and associated data. This action is irreversible.`,
      [
        {
          text: 'Keep Community',
          style: 'cancel',
        },
        {
          text: 'Permanently Delete',
          style: 'destructive',
          onPress: () => {
            deleteCommunity(community.id, {
              onSuccess: () => {
                Alert.alert(
                  'Community Removed',
                  'The community and all its data have been successfully deleted.',
                  [
                    {
                      text: 'Done',
                      onPress: () => onDelete?.(),
                    },
                  ],
                );
              },
              onError: (error: any) => {
                const errorMessage =
                  error?.message ||
                  'Unable to delete community. Please check your connection and try again.';
                Alert.alert('Action Failed', errorMessage);
              },
            });
          },
        },
      ],
      { cancelable: true },
    );
  };

  const handleRemoveMember = (memberId: string, memberName: string) => {
    Alert.alert(
      'Remove Member',
      `Are you sure you want to remove ${memberName} from this community?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            removeMember(
              { communityId: community.id, memberId },
              {
                onSuccess: () => {
                  Alert.alert('Success', `${memberName} has been removed from the community.`);
                },
                onError: (error: any) => {
                  const response = error?.response?.data;
                  let errorMessage = 'Failed to remove member. Please try again.';

                  if (response?.details && Array.isArray(response.details)) {
                    errorMessage = response.details.join('\n');
                  } else if (response?.message) {
                    errorMessage = response.message;
                  } else if (error?.message) {
                    errorMessage = error.message;
                  }

                  Alert.alert('Error', errorMessage);
                },
              },
            );
          },
        },
      ],
    );
  };

  const handlePhotoAction = () => {
    setShowPhotoActionSheet(true);
  };

  const handleViewImage = () => {
    setShowPhotoActionSheet(false);
    setTimeout(() => {
      setShowImageViewer(true);
    }, 300);
  };

  const handleUploadImage = async () => {
    setShowPhotoActionSheet(false);

    // Request permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera roll is required!');
      return;
    }

    // Pick image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];

      // Create FormData
      const formData = new FormData();
      const imageUri = asset.uri;
      const filename = imageUri.split('/').pop() || 'photo.jpg';
      const match = /\.([\w]+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('photo', {
        uri: imageUri,
        name: filename,
        type: type,
      } as any);

      // Upload
      uploadPhoto(
        { communityId: community.id, photoFile: formData },
        {
          onSuccess: () => {
            Alert.alert('Success', 'Community photo updated successfully!');
          },
          onError: (error: any) => {
            const response = error?.response?.data;
            let errorMessage = 'Failed to upload photo. Please try again.';

            if (response?.details && Array.isArray(response.details)) {
              errorMessage = response.details.join('\n');
            } else if (response?.message) {
              errorMessage = response.message;
            } else if (error?.message) {
              errorMessage = error.message;
            }

            Alert.alert('Upload Failed', errorMessage);
          },
        },
      );
    }
  };

  return (
    <ScrollView className="flex-1 bg-background-0" showsVerticalScrollIndicator={false}>
      <VStack className="p-4" space="lg">
        {/* Community Photo & Name */}
        <VStack
          space="md"
          className="items-center rounded-2xl bg-gradient-to-b from-primary-100 to-background-0 p-6"
        >
          {community.photo ? (
            <Pressable
              onPress={handlePhotoAction}
              className="h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-lg"
            >
              <Image
                source={{ uri: community.photo }}
                style={{ width: 88, height: 88 }}
                resizeMode="cover"
              />
              {isUploading && (
                <Box className="absolute inset-0 items-center justify-center bg-black/50">
                  <ActivityIndicator size="small" color="#ffffff" />
                </Box>
              )}
            </Pressable>
          ) : (
            <Pressable
              onPress={isOwner ? handlePhotoAction : undefined}
              className="h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-primary-500 shadow-lg"
            >
              <Text className="text-5xl">🛡️</Text>
            </Pressable>
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

        {/* Owner Actions - AI-styled buttons */}
        {isOwner && (
          <HStack space="md" className="flex-wrap">
            <Button
              onPress={() => setShowEditModal(true)}
              className="min-w-[48%] flex-1 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg"
            >
              <HStack space="sm" className="items-center justify-center py-1">
                <Box className="rounded-full bg-white/20 p-1.5">
                  <Edit size={16} color="#ffffff" />
                </Box>
                <ButtonText className="text-base font-bold text-white">Edit</ButtonText>
              </HStack>
            </Button>
            <Button
              onPress={handleDelete}
              disabled={isDeleting}
              className="min-w-[48%] flex-1 rounded-2xl bg-gradient-to-r from-red-500 to-pink-600 shadow-lg"
            >
              <HStack space="sm" className="items-center justify-center py-1">
                <Box className="rounded-full bg-white/20 p-1.5">
                  <Trash2 size={16} color="#ffffff" />
                </Box>
                <ButtonText className="text-base font-bold text-white">
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </ButtonText>
              </HStack>
            </Button>
          </HStack>
        )}

        {/* Creation Date */}
        <Box className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-background-0 p-4">
          <HStack space="md" className="items-center">
            <Box className="h-10 w-10 items-center justify-center rounded-full bg-green-500">
              <Calendar size={20} color="#ffffff" />
            </Box>
            <VStack className="flex-1" space="xs">
              <Text className="text-xs font-medium text-green-700">Community Created</Text>
              <Text className="text-base font-semibold text-typography-900">
                {new Date(community.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </VStack>
          </HStack>
        </Box>

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
                {community.members.slice(0, 5).map((member, index) => {
                  const isCurrentUser = member.user.id === currentUserId;
                  return (
                    <HStack
                      key={member.user.id || index}
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
                          {isCurrentUser && (
                            <Text className="text-xs text-primary-600"> (You)</Text>
                          )}
                        </Text>
                        <Text className="text-xs text-typography-500">
                          Joined {new Date(member.joinedAt).toLocaleDateString()}
                        </Text>
                      </VStack>
                      {isOwner && !isCurrentUser && (
                        <Pressable
                          onPress={() =>
                            handleRemoveMember(
                              member.user.id,
                              member.user?.UserName || 'this member',
                            )
                          }
                          disabled={isRemoving}
                          className="rounded-lg bg-red-50 p-2 active:bg-red-100"
                        >
                          <UserMinus size={18} color="#ef4444" />
                        </Pressable>
                      )}
                    </HStack>
                  );
                })}
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

      {/* Edit Community Modal */}
      <EditCommunityModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        community={community}
      />

      {/* Photo Action Sheet */}
      <Actionsheet isOpen={showPhotoActionSheet} onClose={() => setShowPhotoActionSheet(false)}>
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <VStack className="w-full" space="xs">
            {community.photo && (
              <ActionsheetItem onPress={handleViewImage}>
                <HStack space="md" className="items-center">
                  <Eye size={20} color="#3b82f6" />
                  <ActionsheetItemText>View Profile Picture</ActionsheetItemText>
                </HStack>
              </ActionsheetItem>
            )}
            {isOwner && (
              <ActionsheetItem onPress={handleUploadImage}>
                <HStack space="md" className="items-center">
                  <Upload size={20} color="#8b5cf6" />
                  <ActionsheetItemText>
                    {community.photo ? 'Change Photo' : 'Upload Photo'}
                  </ActionsheetItemText>
                </HStack>
              </ActionsheetItem>
            )}
            <ActionsheetItem onPress={() => setShowPhotoActionSheet(false)}>
              <HStack space="md" className="items-center">
                <X size={20} color="#6b7280" />
                <ActionsheetItemText>Cancel</ActionsheetItemText>
              </HStack>
            </ActionsheetItem>
          </VStack>
        </ActionsheetContent>
      </Actionsheet>

      {/* Image Viewer Modal */}
      <Modal isOpen={showImageViewer} onClose={() => setShowImageViewer(false)} size="full">
        <ModalBackdrop />
        <ModalContent className="h-full w-full bg-black">
          <ModalHeader className="border-b-0">
            <HStack className="w-full items-center justify-between">
              <Text className="text-lg font-bold text-white">{community.name}</Text>
              <ModalCloseButton>
                <X size={24} color="#ffffff" />
              </ModalCloseButton>
            </HStack>
          </ModalHeader>
          <ModalBody>
            <Box className="flex-1 items-center justify-center">
              {community.photo && (
                <Box
                  className="overflow-hidden rounded-full border-8 border-white shadow-2xl"
                  style={{
                    width: Dimensions.get('window').width * 0.8,
                    height: Dimensions.get('window').width * 0.8,
                  }}
                >
                  <Image
                    source={{ uri: community.photo }}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    resizeMode="cover"
                  />
                </Box>
              )}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </ScrollView>
  );
};
