import { ClanOptionsModal } from "@/components/communities/ClanOptionsModal";
import { CreateClanModal } from "@/components/communities/CreateClanModal";
import { JoinPrivateClanModal } from "@/components/communities/JoinPrivateClanModal";
import { Box } from "@/components/ui/box";
import { Center } from "@/components/ui/center";
import { HStack } from "@/components/ui/hstack";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAvailableClans, useJoinClan, useJoinClanWithCode, useJoinedClans } from "@/hooks/queries/useClan";
import { MoreVertical, Plus, Search, Shield, Users } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, RefreshControl, ScrollView, TextInput } from "react-native";

interface ClansTabProps {
  communityId: string;
  communityName?: string;
}

export function ClansTab({ communityId, communityName }: ClansTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClan, setSelectedClan] = useState<string | null>(null);
  const [showCreateClanModal, setShowCreateClanModal] = useState(false);
  const [showJoinPrivateClanModal, setShowJoinPrivateClanModal] = useState(false);
  const [selectedClanToJoin, setSelectedClanToJoin] = useState<{ id: string; name: string; isPrivate: boolean } | null>(null);
  const [showClanOptions, setShowClanOptions] = useState(false);
  const [selectedClanForOptions, setSelectedClanForOptions] = useState<{ name: string; isMember: boolean } | null>(null);

  // Fetch joined and available clans from API
  const {
    data: joinedClansData,
    isLoading: joinedLoading,
    error: joinedError,
    refetch: refetchJoined,
    isRefetching: isRefetchingJoined,
  } = useJoinedClans(communityId);

  const {
    data: availableClansData,
    isLoading: availableLoading,
    error: availableError,
    refetch: refetchAvailable,
    isRefetching: isRefetchingAvailable,
  } = useAvailableClans(communityId);

  

  // If joined endpoint fails, treat it as empty array but log the error
  if (joinedError) {
    console.error(' Joined clans endpoint error:', joinedError);
  }

  // Join clan mutations
  const { mutate: joinPublicClan, isPending: isJoiningPublic } = useJoinClan();
  const { mutate: joinPrivateClan, isPending: isJoiningPrivate } = useJoinClanWithCode();

  const handleJoinClan = (clanId: string, clanName: string, isPrivate: boolean) => {
    if (isPrivate) {
      setSelectedClanToJoin({ id: clanId, name: clanName, isPrivate: true });
      setShowJoinPrivateClanModal(true);
    } else {
      joinPublicClan(clanId, {
        onSuccess: () => {
          console.log("Successfully joined clan");
        },
        onError: (error: any) => {
          console.error("Failed to join clan:", error);
        },
      });
    }
  };

  const handleJoinPrivateClanWithCode = (code: string, clanId: string) => {
    joinPrivateClan(
      { clanId, inviteCode: code },
      {
        onSuccess: () => {
          console.log("Successfully joined private clan");
          setShowJoinPrivateClanModal(false);
          setSelectedClanToJoin(null);
        },
        onError: (error: any) => {
          console.error("Failed to join private clan:", error);
        },
      }
    );
  };

  const handleRefresh = async () => {
    await Promise.all([refetchJoined(), refetchAvailable()]);
  };
  const joinedClans = joinedClansData?.body?.data || [];
 
  const availableClans = availableClansData?.body?.data || [];
  
  const isLoading = joinedLoading || availableLoading;
  const isRefreshing = isRefetchingJoined || isRefetchingAvailable;
  const error = joinedError || availableError;

  // Filter clans by search
  const filteredJoinedClans = joinedClans.filter((clan) =>
    clan?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredAvailableClans = availableClans.filter((clan) =>
    clan?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <VStack className="flex-1">
      {/* Header with Create Clan Button */}
      <HStack className="px-4 py-3 bg-background-50 items-center justify-between border-b border-outline-200">
        <Pressable
          className="bg-primary-600 px-4 py-2 rounded-lg flex-row items-center gap-2"
          onPress={() => setShowCreateClanModal(true)}
        >
          <Plus size={16} color="#ffffff" />
          <Text className="text-white text-sm font-semibold">Create Clan</Text>
        </Pressable>
      </HStack>

      {/* Search Bar */}
      <Box className="px-4 py-3 bg-background-0 border-b border-outline-200">
        <HStack
          space="md"
          className="bg-background-50 rounded-lg px-3 py-2 items-center border border-outline-200"
        >
          <Search size={18} color="#9ca3af" />
          <TextInput
            placeholder="Search clans..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
            className="flex-1 text-typography-900 text-sm"
          />
        </HStack>
      </Box>

      {/* Loading State */}
      {isLoading ? (
        <Center className="flex-1">
          <Spinner size="large" />
          <Text className="mt-4 text-sm text-typography-500">
            Loading clans...
          </Text>
        </Center>
      ) : error ? (
        <Center className="flex-1 px-4">
          <Text className="text-error-500 text-center">
            Failed to load clans
          </Text>
        </Center>
      ) : (
        /* Clans List with Separate Sections */
        <ScrollView
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={["#8b5cf6"]}
              tintColor="#8b5cf6"
            />
          }
        >
          {/* Joined Clans Section */}
          {filteredJoinedClans.length > 0 && (
            <VStack className="mt-2">
              <Text className="px-4 py-3 text-sm font-bold text-typography-900 bg-background-50">
                Joined Clans
              </Text>
              {filteredJoinedClans.map((clan) => (
                <Pressable
                  key={clan.id}
                  onPress={() => setSelectedClan(clan.id)}
                  className={`mx-4 mb-2 rounded-lg border ${
                    selectedClan === clan.id
                      ? "bg-primary-50 border-primary-500"
                      : "bg-background-0 border-outline-200"
                  }`}
                >
                  <HStack space="md" className="px-4 py-3 items-center">
                    <Box
                      className={`w-12 h-12 rounded-lg items-center justify-center ${
                        selectedClan === clan.id ? "bg-primary-500" : "bg-primary-100"
                      }`}
                    >
                      <Text className="text-2xl">
                        {clan.isPrivate ? "🔒" : "⚔️"}
                      </Text>
                    </Box>
                    <VStack className="flex-1">
                      <Text className="text-sm font-semibold text-typography-900">
                        {clan.name}
                      </Text>
                      <HStack space="xs" className="items-center mt-1">
                        <Users size={12} color="#6b7280" />
                        <Text className="text-xs text-typography-500">
                          {clan.stats?.memberCount || 0} / {clan.limit} members
                        </Text>
                      </HStack>
                    </VStack>
                    <HStack space="xs" className="items-center">
                      <Box className="bg-primary-100 px-2 py-1 rounded">
                        <Text className="text-xs text-primary-700 font-medium">
                          Joined
                        </Text>
                      </Box>
                      <Pressable
                        onPress={(e) => {
                          e.stopPropagation();
                          setSelectedClanForOptions({ name: clan.name, isMember: true });
                          setShowClanOptions(true);
                        }}
                        className="p-1"
                      >
                        <MoreVertical size={18} color="#6b7280" />
                      </Pressable>
                    </HStack>
                  </HStack>
                </Pressable>
              ))}
            </VStack>
          )}

          {/* Available Clans Section */}
          {filteredAvailableClans.length > 0 && (
            <VStack className="mt-4">
              <Text className="px-4 py-3 text-sm font-bold text-typography-900 bg-background-50">
                Available Clans
              </Text>
              {filteredAvailableClans.map((clan) => (
                <Pressable
                  key={clan.id}
                  onPress={() => setSelectedClan(clan.id)}
                  className={`mx-4 mb-2 rounded-lg border ${
                    selectedClan === clan.id
                      ? "bg-primary-50 border-primary-500"
                      : "bg-background-0 border-outline-200"
                  }`}
                >
                  <HStack space="md" className="px-4 py-3 items-center">
                    <Box
                      className={`w-12 h-12 rounded-lg items-center justify-center ${
                        selectedClan === clan.id ? "bg-primary-500" : "bg-primary-100"
                      }`}
                    >
                      <Text className="text-2xl">
                        {clan.isPrivate ? "🔒" : "⚔️"}
                      </Text>
                    </Box>
                    <VStack className="flex-1">
                      <Text className="text-sm font-semibold text-typography-900">
                        {clan.name}
                      </Text>
                      <HStack space="xs" className="items-center mt-1">
                        <Users size={12} color="#6b7280" />
                        <Text className="text-xs text-typography-500">
                          {clan.stats?.memberCount || 0} / {clan.limit} members
                        </Text>
                      </HStack>
                    </VStack>
                    <HStack space="xs" className="items-center">
                      <Pressable
                        onPress={(e) => {
                          e.stopPropagation();
                          handleJoinClan(clan.id, clan.name, clan.isPrivate);
                        }}
                        disabled={isJoiningPublic || isJoiningPrivate}
                        className="bg-primary-600 px-4 py-2 rounded-lg"
                      >
                        <Text className="text-white text-xs font-semibold">
                          {isJoiningPublic || isJoiningPrivate ? "Joining..." : "Join"}
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={(e) => {
                          e.stopPropagation();
                          setSelectedClanForOptions({ name: clan.name, isMember: false });
                          setShowClanOptions(true);
                        }}
                        className="p-1"
                      >
                        <MoreVertical size={18} color="#6b7280" />
                      </Pressable>
                    </HStack>
                  </HStack>
                </Pressable>
              ))}
            </VStack>
          )}

          {/* Empty State */}
          {filteredJoinedClans.length === 0 && filteredAvailableClans.length === 0 && (
            <Center className="py-20">
              <Shield size={48} color="#d1d5db" />
              <Text className="mt-4 text-typography-500">No clans found</Text>
            </Center>
          )}
        </ScrollView>
      )}

      {/* Create Clan Modal */}
      <CreateClanModal
        visible={showCreateClanModal}
        onClose={() => setShowCreateClanModal(false)}
        communityId={communityId}
      />

      {/* Join Private Clan Modal */}
      <JoinPrivateClanModal
        visible={showJoinPrivateClanModal}
        onClose={() => {
          setShowJoinPrivateClanModal(false);
          setSelectedClanToJoin(null);
        }}
        onJoin={handleJoinPrivateClanWithCode}
        isLoading={isJoiningPrivate}
        clanId={selectedClanToJoin?.id}
        clanName={selectedClanToJoin?.name}
        communityName={communityName}
      />

      {/* Clan Options Modal */}
      <ClanOptionsModal
        visible={showClanOptions}
        onClose={() => {
          setShowClanOptions(false);
          setSelectedClanForOptions(null);
        }}
        clanName={selectedClanForOptions?.name}
        isMember={selectedClanForOptions?.isMember}
      />
    </VStack>
  );
}
