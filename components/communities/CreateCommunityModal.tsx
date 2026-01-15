import { useCreateCommunity } from '@/hooks/queries/useCommunities';
import { CreateCommunityInput, createCommunitySchema } from '@/schemas/community/createCommunity';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView } from 'react-native';

// gluestack-ui components
import { Box } from '@/components/ui/box';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { VStack } from '@/components/ui/vstack';
import { Globe, Lock, Upload, X } from 'lucide-react-native';

interface CreateCommunityModalProps {
  visible: boolean;
  onClose: () => void;
}

export function CreateCommunityModal({ visible, onClose }: CreateCommunityModalProps) {
  const { mutate: createCommunity, isPending } = useCreateCommunity();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateCommunityInput>({
    resolver: zodResolver(createCommunitySchema),
    defaultValues: {
      communityName: '',
      description: '',
      memberLimit: 100,
      isPrivate: false,
    },
  });

  const isPrivate = watch('isPrivate');

  const onSubmit = (data: CreateCommunityInput) => {
    const formData = new FormData();
    formData.append('communityName', data.communityName);
    if (data.description) formData.append('description', data.description);
    if (data.memberLimit) formData.append('memberLimit', String(data.memberLimit));
    formData.append('isPrivate', String(data.isPrivate));
    if (data.photo) formData.append('photo', data.photo);

    createCommunity(formData, {
      onSuccess: () => {
        reset();
        onClose();
      },
      onError: error => {
        console.error('API Submission Error:', error);
      },
    });
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <Box className="flex-1 justify-center p-4 bg-background-900/70">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Box className="overflow-hidden rounded-[24px] border border-outline-300 bg-background-50 shadow-2xl">
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ padding: 20 }}
            >
              <VStack space="xl">
                {/* Header */}
                <HStack className="items-start justify-between">
                  <VStack space="xs">
                    <Heading className="text-xl font-bold text-primary-600">
                      Create New Community
                    </Heading>
                    <Text className="text-xs text-typography-500">
                      Fill in the details to create your community
                    </Text>
                  </VStack>
                  <Pressable onPress={onClose}>
                    <X size={20} color="#6b7280" />
                  </Pressable>
                </HStack>

                <HStack space="md" className="items-start">
                  {/* Left Column: Image */}
                  <VStack space="xs" className="items-center">
                    <Text className="self-start text-xs font-medium text-typography-900">
                      Community Image
                    </Text>
                    <Pressable className="h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-outline-300 bg-background-100">
                      <VStack space="xs" className="items-center">
                        <Upload size={20} color="#8b5cf6" />
                        <Text className="text-center text-[9px] font-bold uppercase text-primary-600">
                          Upload{'\n'}Image
                        </Text>
                      </VStack>
                    </Pressable>
                  </VStack>

                  {/* Right Column: Inputs */}
                  <VStack space="md" className="flex-1">
                    {/* Community Name */}
                    <VStack space="xs">
                      <Text className="text-xs font-medium text-typography-900">
                        Community Name <Text className="text-red-500">*</Text>
                      </Text>
                      <Controller
                        control={control}
                        name="communityName"
                        render={({ field: { onChange, value } }) => (
                          <Input
                            isInvalid={!!errors.communityName}
                            className="h-10 rounded-lg border-outline-200 bg-background-0"
                          >
                            <InputField
                              placeholder="Enter community name"
                              value={value}
                              onChangeText={onChange}
                              className="text-xs text-typography-900"
                              placeholderTextColor="#9ca3af"
                            />
                          </Input>
                        )}
                      />
                      {errors.communityName && (
                        <Text className="mt-0.5 text-[10px] text-red-400">
                          {errors.communityName.message}
                        </Text>
                      )}
                    </VStack>

                    {/* Description */}
                    <VStack space="xs">
                      <Text className="text-xs font-medium text-typography-900">
                        Description <Text className="text-red-500">*</Text>
                      </Text>
                      <Controller
                        control={control}
                        name="description"
                        render={({ field: { onChange, value } }) => (
                          <Textarea
                            isInvalid={!!errors.description}
                            className="min-h-[80px] rounded-lg border-outline-200 bg-background-0"
                          >
                            <TextareaInput
                              placeholder="Describe your community..."
                              value={value}
                              onChangeText={onChange}
                              className="text-xs text-typography-900"
                              placeholderTextColor="#9ca3af"
                            />
                          </Textarea>
                        )}
                      />
                      {errors.description && (
                        <Text className="mt-0.5 text-[10px] text-red-400">
                          {errors.description.message}
                        </Text>
                      )}
                    </VStack>
                  </VStack>
                </HStack>

                {/* Member Limit */}
                <VStack space="xs">
                  <Text className="text-xs font-medium text-typography-900">
                    Member Limit <Text className="font-normal text-typography-500">(1-1000)</Text>
                  </Text>
                  <Controller
                    control={control}
                    name="memberLimit"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        isInvalid={!!errors.memberLimit}
                        className="h-10 rounded-lg border-outline-200 bg-background-0"
                      >
                        <InputField
                          value={String(value)}
                          onChangeText={v => onChange(v ? Number(v) : 0)}
                          keyboardType="numeric"
                          className="text-xs text-typography-900"
                        />
                      </Input>
                    )}
                  />
                  {errors.memberLimit && (
                    <Text className="text-[10px] text-red-400">{errors.memberLimit.message}</Text>
                  )}
                </VStack>

                {/* Private Toggle */}
                <VStack space="xs">
                  <Text className="text-xs font-medium text-typography-900">Privacy Settings</Text>
                  <HStack className="items-center justify-between rounded-xl border border-outline-200 bg-background-100 px-4 py-3">
                    <HStack space="md" className="flex-1 items-center">
                      <HStack space="xs" className="items-center">
                        {isPrivate ? (
                          <Lock size={16} color="#f97316" />
                        ) : (
                          <Globe size={16} color="#10b981" />
                        )}
                        <Text className="text-xs font-bold text-typography-900">
                          {isPrivate ? 'Private' : 'Public'}
                        </Text>
                      </HStack>
                      {isPrivate && (
                        <Box className="rounded bg-orange-500/20 px-2 py-1">
                          <Text className="text-[9px] font-semibold text-orange-400">
                            Only invited members can join
                          </Text>
                        </Box>
                      )}
                    </HStack>
                    <Controller
                      control={control}
                      name="isPrivate"
                      render={({ field: { onChange, value } }) => (
                        <Switch
                          value={value}
                          onValueChange={onChange}
                          trackColor={{ false: '#9ca3af', true: '#8b5cf6' }}
                        />
                      )}
                    />
                  </HStack>
                </VStack>

                {/* Footer Buttons */}
                <HStack space="md" className="mt-2 justify-end">
                  <Pressable
                    onPress={onClose}
                    className="rounded-lg bg-background-200 px-6 py-2 active:bg-background-300"
                  >
                    <Text className="text-sm font-bold text-typography-700">Cancel</Text>
                  </Pressable>
                  <Button
                    onPress={handleSubmit(onSubmit)}
                    isDisabled={isPending}
                    className="rounded-lg bg-primary-600 px-6 py-2 shadow-md"
                  >
                    {isPending && <ButtonSpinner className="mr-2" />}
                    <ButtonText className="text-sm font-bold text-white">
                      Create Community
                    </ButtonText>
                  </Button>
                </HStack>
              </VStack>
            </ScrollView>
          </Box>
        </KeyboardAvoidingView>
      </Box>
    </Modal>
  );
}
