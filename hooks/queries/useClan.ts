import {
  createClan,
  CreateClanPayload,
  deleteClan,
  getClanInfo,
  getClanMembers,
  getClansByCommunity,
  joinClan,
  leaveClan,
} from "@/api/endPoints/clans";
import LanguageStore from "@/stores/language.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Get clans by community
 */
export const useClansByCommunity = (communityId: string) => {
  const language = LanguageStore.getState().language;
  return useQuery({
    queryKey: ["clans", communityId],
    queryFn: () => getClansByCommunity(communityId, language),
    enabled: !!communityId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Get clan info
 */
export const useClanInfo = (clanId: string) => {
  const language = LanguageStore.getState().language;
  return useQuery({
    queryKey: ["clan", clanId],
    queryFn: () => getClanInfo(clanId, language),
    enabled: !!clanId,
    staleTime: 2 * 60 * 1000,
  });
};

/**
 * Get clan members
 */
export const useClanMembers = (clanId: string) => {
  const language = LanguageStore.getState().language;
  return useQuery({
    queryKey: ["clan", clanId, "members"],
    queryFn: () => getClanMembers(clanId, language),
    enabled: !!clanId,
    staleTime: 2 * 60 * 1000,
  });
};

/**
 * Create clan mutation
 */
export const useCreateClan = () => {
  const queryClient = useQueryClient();
  const language = LanguageStore.getState().language;

  return useMutation({
    mutationFn: (payload: CreateClanPayload) => createClan(payload, language),
    onSuccess: (data, variables) => {
      // Invalidate clans list for the specific community
      queryClient.invalidateQueries({
        queryKey: ["clans", variables.communityId],
      });
    },
  });
};

/**
 * Join clan mutation
 */
export const useJoinClan = () => {
  const queryClient = useQueryClient();
  const language = LanguageStore.getState().language;

  return useMutation({
    mutationFn: (clanId: string) => joinClan(language, clanId),
    onSuccess: () => {
      // Invalidate queries to refresh clan data
      queryClient.invalidateQueries({ queryKey: ["clans"] });
      queryClient.invalidateQueries({ queryKey: ["clan"] });
    },
  });
};

/**
 * Leave clan mutation
 */
export const useLeaveClan = () => {
  const queryClient = useQueryClient();
  const language = LanguageStore.getState().language;

  return useMutation({
    mutationFn: (clanId: string) => leaveClan(clanId, language),
    onSuccess: () => {
      // Invalidate queries to refresh clan data
      queryClient.invalidateQueries({ queryKey: ["clans"] });
      queryClient.invalidateQueries({ queryKey: ["clan"] });
    },
  });
};

/**
 * Delete clan mutation
 */
export const useDeleteClan = () => {
  const queryClient = useQueryClient();
  const language = LanguageStore.getState().language;

  return useMutation({
    mutationFn: (clanId: string) => deleteClan(clanId, language),
    onSuccess: () => {
      // Invalidate queries to refresh clan data
      queryClient.invalidateQueries({ queryKey: ["clans"] });
    },
  });
};
