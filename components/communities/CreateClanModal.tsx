import { Box } from '@/components/ui/box';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useCreateClan } from '@/hooks/queries/useClan';
import { CreateClanInputSchema, createClanSchema } from '@/schemas/clan/createClan';
import { useTranslation } from '@/translation';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Modal, Pressable, ScrollView, Switch } from 'react-native';
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '../ui/form-control';
import { Input, InputField } from '../ui/input';
import { Textarea, TextareaInput } from '../ui/textarea';

interface CreateClanModalProps {
  visible: boolean;
  onClose: () => void;
  communityId: string;
}

export const CreateClanModal: React.FC<CreateClanModalProps> = ({
  visible,
  onClose,
  communityId,
}) => {
  const [clanName, setClanName] = useState('');
  const [description, setDescription] = useState('');
  const [memberLimit, setMemberLimit] = useState('50');
  const [isPrivate, setIsPrivate] = useState(false);
  const { t } = useTranslation();
  const { mutate, isError, isPending } = useCreateClan();

  const form = useForm<CreateClanInputSchema>({
    resolver: zodResolver(createClanSchema),
    defaultValues: {
      name: '',
      communityId: communityId,
      description: '',
      limit: 0,
      isPrivate: false,
    },
    mode: 'onChange',
  });
  const {
    handleSubmit,
    formState: { errors, isValid },
    setError,
    reset,
  } = form;

  const onSubmit = async (data: CreateClanInputSchema) => {
    try {
      await mutate(data);

      handleClose();
    } catch (err: any) {
      const errorMessage = err?.message || t('error.auth.loginFailed');
      setError('root', {
        type: 'server',
        message: errorMessage,
      });
    }
  };
  const handleClose = () => {
    setClanName('');
    setDescription('');
    setMemberLimit('50');
    setIsPrivate(false);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={handleClose}>
      <Pressable
        className="flex-1 items-center justify-center bg-black/50 px-4"
        onPress={handleClose}
      >
        <Pressable
          className="w-full max-w-md rounded-2xl bg-white"
          onPress={e => e.stopPropagation()}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <Box>
              {/* Header */}
              <HStack className="items-center justify-between">
                <VStack space="xs">
                  <Heading size="lg" className="text-typography-900">
                    Create New Clan
                  </Heading>
                  <Text className="text-sm text-typography-500">
                    Create a new clan within this community. Fill in the details below.
                  </Text>
                </VStack>
                <Pressable onPress={handleClose} className="-mr-2 p-2">
                  <X size={24} color="#6b7280" />
                </Pressable>
              </HStack>

              {/* Name Field */}
              <FormControl isInvalid={!!errors.name} isRequired>
                <HStack className="mb-1 items-center justify-between">
                  <FormControlLabel>
                    <FormControlLabelText className="text-typography-900">
                      Clan Name
                    </FormControlLabelText>
                  </FormControlLabel>
                </HStack>

                <Controller
                  control={form.control}
                  name="name"
                  render={({ field: { value, onChange } }) => (
                    <Input className="border-outline-300" size="lg" isInvalid={!!errors.name}>
                      <InputField
                        type="text"
                        placeholder="Enter clan name"
                        value={value}
                        onChangeText={txt => {
                          form.clearErrors('root');
                          onChange(txt);
                        }}
                        autoCapitalize="none"
                        autoComplete="name"
                      />
                    </Input>
                  )}
                />

                {errors.name && (
                  <FormControlError>
                    <FormControlErrorIcon as={AlertCircle} />
                    <FormControlErrorText>{errors.name.message}</FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>

              {/* Description */}
              <FormControl isInvalid={!!errors.description} isRequired>
                <HStack className="mb-1 items-center justify-between">
                  <FormControlLabel>
                    <FormControlLabelText className="text-typography-900">
                      Clan Description
                    </FormControlLabelText>
                  </FormControlLabel>
                </HStack>

                <Controller
                  control={form.control}
                  name="description"
                  render={({ field: { value, onChange } }) => (
                    <Textarea
                      isInvalid={!!errors.description}
                      className="min-h-[80px] rounded-lg border-outline-200 bg-background-0"
                    >
                      <TextareaInput
                        placeholder="Describe your clan..."
                        value={value}
                        onChangeText={onChange}
                        className="text-xs text-typography-900"
                        placeholderTextColor="#9ca3af"
                      />
                    </Textarea>
                  )}
                />

                {errors.description && (
                  <FormControlError>
                    <FormControlErrorIcon as={AlertCircle} />
                    <FormControlErrorText>{errors.description.message}</FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>
              {/* limit */}
              <FormControl isInvalid={!!errors.limit} isRequired>
                <HStack className="mb-1 items-center justify-between">
                  <FormControlLabel>
                    <FormControlLabelText className="text-typography-900">
                      Member limit
                    </FormControlLabelText>
                  </FormControlLabel>
                </HStack>

                <Controller
                  control={form.control}
                  name="limit"
                  render={({ field: { value, onChange } }) => (
                    <Input className="border-outline-300" size="lg" isInvalid={!!errors.name}>
                      <InputField
                        keyboardType="numeric"
                        placeholder="Enter clan name"
                        value={String(value)}
                        onChangeText={txt => {
                          form.clearErrors('root');
                          onChange(txt);
                        }}
                      />
                    </Input>
                  )}
                />

                {errors.limit && (
                  <FormControlError>
                    <FormControlErrorIcon as={AlertCircle} />
                    <FormControlErrorText>{errors.limit.message}</FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>

              {/* Private Clan Toggle */}
              <FormControl isInvalid={!!errors.limit} isRequired>
                <HStack className="mb-1 items-center justify-between">
                  <FormControlLabel>
                    <FormControlLabelText className="text-typography-900">
                      Private Clan
                    </FormControlLabelText>
                    <FormControlLabelText className="mt-1 text-xs text-typography-500">
                      Only invited members can join
                    </FormControlLabelText>
                  </FormControlLabel>
                </HStack>
                <Controller
                  control={form.control}
                  name="isPrivate"
                  render={({ field: { value, onChange } }) => (
                    <Switch
                      value={isPrivate}
                      onValueChange={setIsPrivate}
                      trackColor={{ false: '#d1d5db', true: '#8b5cf6' }}
                      thumbColor="#ffffff"
                    />
                  )}
                />

                {errors.isPrivate && (
                  <FormControlError>
                    <FormControlErrorIcon as={AlertCircle} />
                    <FormControlErrorText>{errors.isPrivate.message}</FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>
              {/* Action Buttons */}
              <Button
                className="mt-4 bg-typography-900"
                onPress={handleSubmit(onSubmit)}
                disabled={isPending || !isValid}
              >
                {isPending ? (
                  <>
                    <ButtonSpinner className="mr-2" />
                    <ButtonText>{t('profile.form.submitting')}</ButtonText>
                  </>
                ) : (
                  <ButtonText>{t('profile.form.submit')}</ButtonText>
                )}
              </Button>
            </Box>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
