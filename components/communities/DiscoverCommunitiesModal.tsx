import { Community } from "@/api/generated";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import {
  useJoinCommunity,
  useSearchCommunities,
} from "@/hooks/queries/useCommunities";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Globe,
  Key,
  Lock,
  Search,
  TrendingUp,
  Users,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
} from "react-native";

interface DiscoverCommunitiesModalProps {
  visible: boolean;
  onClose: () => void;
  onJoinPrivate: () => void;
}

export function DiscoverCommunitiesModal({
  visible,
  onClose,
  onJoinPrivate,
}: DiscoverCommunitiesModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "mostJoined" | "public" | "private"
  >("all");

  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data, isLoading } = useSearchCommunities(debouncedSearch);
  const { mutate: joinCommunity, isPending: isJoining } = useJoinCommunity();

  const communities = data?.body?.data || [];

  // Filter and sort communities based on active filter
  const filteredCommunities = communities
    .filter((community) => {
      if (activeFilter === "all" || activeFilter === "mostJoined") return true;
      if (activeFilter === "public") return !community.isPrivate;
      if (activeFilter === "private") return community.isPrivate;
      return true;
    })
    .sort((a, b) => {
      if (activeFilter === "mostJoined") {
        const aCount = a._count?.members || 0;
        const bCount = b._count?.members || 0;
        return bCount - aCount; // Sort descending by member count
      }
      return 0;
    });

  const handleJoinCommunity = (communityId: string) => {
    joinCommunity(communityId);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <Box className="flex-1 bg-white">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <VStack className="flex-1">
            {/* Header */}
            <HStack className="px-6 pt-12 pb-4 justify-between items-center border-b border-outline-200">
              <VStack space="xs" className="flex-1">
                <Heading size="2xl" className="text-typography-900">
                  Discover Communities
                </Heading>
                <Text className="text-sm text-typography-500">
                  Search and join communities that match your interests
                </Text>
              </VStack>
              <Pressable onPress={onClose}>
                <X size={24} color="#374151" />
              </Pressable>
            </HStack>

            {/* Tabs */}
            <HStack space="sm" className="px-6 mt-4">
              <Pressable className="flex-1 py-3 rounded-lg items-center justify-center bg-primary-500">
                <HStack space="xs" className="items-center">
                  <Search size={18} color="#ffffff" />
                  <Text className="text-sm font-semibold text-white">
                    Search Communities
                  </Text>
                </HStack>
              </Pressable>

              <Pressable
                onPress={onJoinPrivate}
                className="flex-1 py-3 rounded-lg items-center justify-center bg-background-50"
              >
                <HStack space="xs" className="items-center">
                  <Key size={18} color="#6b7280" />
                  <Text className="text-sm font-semibold text-typography-600">
                    Join Private Community
                  </Text>
                </HStack>
              </Pressable>
            </HStack>

            {/* Search Input */}
            <VStack className="px-6 mt-6" space="md">
              <Input variant="outline" size="lg" className="border-outline-300">
                <InputSlot className="pl-3">
                  <InputIcon as={Search} className="text-typography-400" />
                </InputSlot>
                <InputField
                  placeholder="Search communities..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor="#9ca3af"
                />
              </Input>

              {/* Filters */}
              {debouncedSearch.length > 0 && (
                <HStack space="sm">
                  <Text className="text-sm text-typography-600 mr-2">
                    Filter:
                  </Text>
                  <Pressable
                    onPress={() => setActiveFilter("all")}
                    className={`px-3 py-1.5 rounded-lg ${
                      activeFilter === "all"
                        ? "bg-primary-500"
                        : "bg-background-100"
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        activeFilter === "all"
                          ? "text-white"
                          : "text-typography-600"
                      }`}
                    >
                      All
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setActiveFilter("mostJoined")}
                    className={`px-3 py-1.5 rounded-lg ${
                      activeFilter === "mostJoined"
                        ? "bg-primary-500"
                        : "bg-background-100"
                    }`}
                  >
                    <HStack space="xs" className="items-center">
                      <TrendingUp
                        size={12}
                        color={
                          activeFilter === "mostJoined" ? "#ffffff" : "#6b7280"
                        }
                      />
                      <Text
                        className={`text-xs font-semibold ${
                          activeFilter === "mostJoined"
                            ? "text-white"
                            : "text-typography-600"
                        }`}
                      >
                        Most Joined
                      </Text>
                    </HStack>
                  </Pressable>
                  <Pressable
                    onPress={() => setActiveFilter("public")}
                    className={`px-3 py-1.5 rounded-lg ${
                      activeFilter === "public"
                        ? "bg-primary-500"
                        : "bg-background-100"
                    }`}
                  >
                    <HStack space="xs" className="items-center">
                      <Globe
                        size={12}
                        color={
                          activeFilter === "public" ? "#ffffff" : "#6b7280"
                        }
                      />
                      <Text
                        className={`text-xs font-semibold ${
                          activeFilter === "public"
                            ? "text-white"
                            : "text-typography-600"
                        }`}
                      >
                        Public
                      </Text>
                    </HStack>
                  </Pressable>
                  <Pressable
                    onPress={() => setActiveFilter("private")}
                    className={`px-3 py-1.5 rounded-lg ${
                      activeFilter === "private"
                        ? "bg-primary-500"
                        : "bg-background-100"
                    }`}
                  >
                    <HStack space="xs" className="items-center">
                      <Lock
                        size={12}
                        color={
                          activeFilter === "private" ? "#ffffff" : "#6b7280"
                        }
                      />
                      <Text
                        className={`text-xs font-semibold ${
                          activeFilter === "private"
                            ? "text-white"
                            : "text-typography-600"
                        }`}
                      >
                        Private
                      </Text>
                    </HStack>
                  </Pressable>
                </HStack>
              )}
            </VStack>

            {/* Content */}
            <Box className="flex-1 px-6 mt-4">
              {debouncedSearch.length === 0 ? (
                <Center className="flex-1">
                  <VStack space="md" className="items-center max-w-xs">
                    <Box className="w-24 h-24 rounded-full bg-background-100 items-center justify-center">
                      <Search size={48} color="#9ca3af" strokeWidth={1.5} />
                    </Box>
                    <Text className="text-center text-typography-600">
                      Start typing to search for communities
                    </Text>
                  </VStack>
                </Center>
              ) : isLoading ? (
                <Center className="flex-1">
                  <Spinner size="large" />
                  <Text className="mt-4 text-sm text-typography-500">
                    Searching communities...
                  </Text>
                </Center>
              ) : filteredCommunities.length === 0 ? (
                <Center className="flex-1">
                  <VStack space="md" className="items-center max-w-xs">
                    <Box className="w-24 h-24 rounded-full bg-background-100 items-center justify-center">
                      <Search size={48} color="#9ca3af" strokeWidth={1.5} />
                    </Box>
                    <Text className="text-center text-typography-600">
                      No communities found
                    </Text>
                    <Text className="text-center text-xs text-typography-400">
                      Try adjusting your search or filters
                    </Text>
                  </VStack>
                </Center>
              ) : (
                <VStack space="xs" className="flex-1">
                  <Text className="text-sm text-typography-500 mb-2">
                    Showing {filteredCommunities.length} of {communities.length}{" "}
                    communities
                  </Text>
                  <FlatList
                    data={filteredCommunities}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <CommunityItem
                        community={item}
                        onJoin={handleJoinCommunity}
                        isJoining={isJoining}
                      />
                    )}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <Box className="h-3" />}
                  />
                </VStack>
              )}
            </Box>
          </VStack>
        </KeyboardAvoidingView>
      </Box>
    </Modal>
  );
}

interface CommunityItemProps {
  community: Community;
  onJoin: (communityId: string) => void;
  isJoining: boolean;
}

function CommunityItem({ community, onJoin, isJoining }: CommunityItemProps) {
  const memberCount = community._count?.members || 0;
  const isPrivate = community.isPrivate;

  return (
    <Box className="bg-background-50 rounded-xl p-4 border border-outline-200">
      <HStack className="justify-between items-start">
        <VStack space="xs" className="flex-1 mr-3">
          <HStack space="xs" className="items-center">
            {isPrivate ? (
              <Lock size={14} color="#8b5cf6" />
            ) : (
              <Globe size={14} color="#10b981" />
            )}
            <Heading size="sm" className="text-typography-900">
              {community.name}
            </Heading>
            {isPrivate && (
              <Badge size="sm" variant="solid" className="bg-primary-500">
                <BadgeText className="text-[9px]">Private</BadgeText>
              </Badge>
            )}
          </HStack>

          {community.description && (
            <Text className="text-sm text-typography-500" numberOfLines={2}>
              {community.description}
            </Text>
          )}

          <HStack space="xs" className="items-center mt-1">
            <Users size={14} color="#6b7280" />
            <Text className="text-xs text-typography-500">
              {memberCount} / {community.memberLimit} members
            </Text>
          </HStack>
        </VStack>

        <Button
          // onPress={() => onJoin(community.id)}
          isDisabled={isJoining}
          size="sm"
          className={`${isPrivate ? "bg-warning-500" : "bg-success-500"} px-4`}
        >
          {isJoining && <ButtonSpinner className="mr-1" />}
          <ButtonText className="text-white text-[8px] font-bold">
            {isPrivate ? "Request Join-coming soon" : "Join"}
          </ButtonText>
        </Button>
      </HStack>
    </Box>
  );
}
