import { useCreateCommunity } from "@/hooks/queries/useCommunities";
import {
  CreateCommunityInput,
  createCommunitySchema,
} from "@/schemas/community/createCommunity";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
} from "react-native";

// gluestack-ui components
import { Box } from "@/components/ui/box";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { VStack } from "@/components/ui/vstack";
import { Globe, Lock, Upload, X } from "lucide-react-native";

interface CreateCommunityModalProps {
  visible: boolean;
  onClose: () => void;
}

export function CreateCommunityModal({
  visible,
  onClose,
}: CreateCommunityModalProps) {
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
      communityName: "",
      description: "",
      memberLimit: 100,
      isPrivate: false,
    },
  });

  const isPrivate = watch("isPrivate");

  const onSubmit = (data: CreateCommunityInput) => {
    const formData = new FormData();
    formData.append("communityName", data.communityName);
    if (data.description) formData.append("description", data.description);
    if (data.memberLimit)
      formData.append("memberLimit", String(data.memberLimit));
    formData.append("isPrivate", String(data.isPrivate));
    if (data.photo) formData.append("photo", data.photo);

    createCommunity(formData, {
      onSuccess: () => {
        reset();
        onClose();
      },
      onError: (error) => {
        console.error("API Submission Error:", error);
      },
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <Box
        className="flex-1 justify-center p-4"
        style={{ backgroundColor: "rgba(10, 15, 24, 0.7)" }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Box className="bg-[#1e293b] rounded-[24px] border border-slate-700 shadow-2xl overflow-hidden">
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ padding: 20 }}
            >
              <VStack space="xl">
                {/* Header */}
                <HStack className="justify-between items-start">
                  <VStack space="xs">
                    <Heading className="text-[#38bdf8] text-xl font-bold">
                      Create New Community
                    </Heading>
                    <Text className="text-slate-300 text-xs">
                      Fill in the details to create your community
                    </Text>
                  </VStack>
                  <Pressable onPress={onClose}>
                    <X size={20} color="#94a3b8" />
                  </Pressable>
                </HStack>

                <HStack space="md" className="items-start">
                  {/* Left Column: Image */}
                  <VStack space="xs" className="items-center">
                    <Text className="text-slate-100 text-xs font-medium self-start">
                      Community Image
                    </Text>
                    <Pressable className="w-24 h-24 rounded-full border-2 border-dashed border-slate-600 items-center justify-center bg-[#0f172a]">
                      <VStack space="xs" className="items-center">
                        <Upload size={20} color="#0ea5e9" />
                        <Text className="text-[#0ea5e9] text-[9px] font-bold uppercase text-center">
                          Upload{"\n"}Image
                        </Text>
                      </VStack>
                    </Pressable>
                  </VStack>

                  {/* Right Column: Inputs */}
                  <VStack space="md" className="flex-1">
                    {/* Community Name */}
                    <VStack space="xs">
                      <Text className="text-slate-100 text-xs font-medium">
                        Community Name <Text className="text-red-500">*</Text>
                      </Text>
                      <Controller
                        control={control}
                        name="communityName"
                        render={({ field: { onChange, value } }) => (
                          <Input
                            isInvalid={!!errors.communityName}
                            className="border-slate-600 bg-[#0a0f18] h-10 rounded-lg"
                          >
                            <InputField
                              placeholder="Enter community name"
                              value={value}
                              onChangeText={onChange}
                              className="text-white text-xs"
                              placeholderTextColor="#64748b"
                            />
                          </Input>
                        )}
                      />
                      {errors.communityName && (
                        <Text className="text-red-400 text-[10px] mt-0.5">
                          {errors.communityName.message}
                        </Text>
                      )}
                    </VStack>

                    {/* Description */}
                    <VStack space="xs">
                      <Text className="text-slate-100 text-xs font-medium">
                        Description <Text className="text-red-500">*</Text>
                      </Text>
                      <Controller
                        control={control}
                        name="description"
                        render={({ field: { onChange, value } }) => (
                          <Textarea
                            isInvalid={!!errors.description}
                            className="border-slate-600 bg-[#0a0f18] min-h-[80px] rounded-lg"
                          >
                            <TextareaInput
                              placeholder="Describe your community..."
                              value={value}
                              onChangeText={onChange}
                              className="text-white text-xs"
                              placeholderTextColor="#64748b"
                            />
                          </Textarea>
                        )}
                      />
                      {errors.description && (
                        <Text className="text-red-400 text-[10px] mt-0.5">
                          {errors.description.message}
                        </Text>
                      )}
                    </VStack>
                  </VStack>
                </HStack>

                {/* Member Limit */}
                <VStack space="xs">
                  <Text className="text-slate-100 text-xs font-medium">
                    Member Limit{" "}
                    <Text className="text-slate-400 font-normal">(1-1000)</Text>
                  </Text>
                  <Controller
                    control={control}
                    name="memberLimit"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        isInvalid={!!errors.memberLimit}
                        className="border-slate-600 bg-[#0a0f18] h-10 rounded-lg"
                      >
                        <InputField
                          value={String(value)}
                          onChangeText={(v) => onChange(v ? Number(v) : 0)}
                          keyboardType="numeric"
                          className="text-white text-xs"
                        />
                      </Input>
                    )}
                  />
                  {errors.memberLimit && (
                    <Text className="text-red-400 text-[10px]">
                      {errors.memberLimit.message}
                    </Text>
                  )}
                </VStack>

                {/* Private Toggle */}
                <VStack space="xs">
                  <Text className="text-slate-100 text-xs font-medium">
                    Privacy Settings
                  </Text>
                  <HStack className="bg-[#334155]/50 px-4 py-3 rounded-xl items-center justify-between border border-slate-600">
                    <HStack space="md" className="items-center flex-1">
                      <HStack space="xs" className="items-center">
                        {isPrivate ? (
                          <Lock size={16} color="#f97316" />
                        ) : (
                          <Globe size={16} color="#10b981" />
                        )}
                        <Text className="text-white text-xs font-bold">
                          {isPrivate ? "Private" : "Public"}
                        </Text>
                      </HStack>
                      {isPrivate && (
                        <Box className="bg-orange-500/20 px-2 py-1 rounded">
                          <Text className="text-orange-400 text-[9px] font-semibold">
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
                          trackColor={{ false: "#475569", true: "#0ea5e9" }}
                        />
                      )}
                    />
                  </HStack>
                </VStack>

                {/* Footer Buttons */}
                <HStack space="md" className="justify-end mt-2">
                  <Pressable
                    onPress={onClose}
                    className="bg-white/90 px-6 py-2 rounded-lg active:bg-white"
                  >
                    <Text className="text-slate-700 text-sm font-bold">
                      Cancel
                    </Text>
                  </Pressable>
                  <Button
                    onPress={handleSubmit(onSubmit)}
                    isDisabled={isPending}
                    className="bg-[#00adef] px-6 py-2 rounded-lg shadow-md"
                  >
                    {isPending && <ButtonSpinner className="mr-2" />}
                    <ButtonText className="text-white text-sm font-bold">
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
