import {
  createClan,
  CreateClanPayload,
  deleteClan,
  getAvailableClans,
  getClanInfo,
  getClanMembers,
  getClansByCommunity,
  getJoinedClans,
  joinClan,
  joinClanWithCode,
  leaveClan,
} from '@/api/endPoints/clans';
import authStore from '@/stores/auth.store';
import LanguageStore from '@/stores/language.store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * Get clans by community
 */
export const useClansByCommunity = (communityId: string) => {
  const language = LanguageStore.getState().language;
  const authSession = authStore.getState().authSession as string;
  return useQuery({
    queryKey: ['clans', communityId],
    queryFn: () => getClansByCommunity(communityId, language, authSession),
    enabled: !!communityId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Get joined clans for a community
 */
export const useJoinedClans = (communityId: string) => {
  const language = LanguageStore.getState().language;
  const authSession = authStore.getState().authSession as string;
  return useQuery({
    queryKey: ['clans', communityId, 'joined'],
    queryFn: () => getJoinedClans(communityId, language, authSession),
    enabled: !!communityId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Get available clans (not joined) for a community
 */
export const useAvailableClans = (communityId: string) => {
  const language = LanguageStore.getState().language;
  const authSession = authStore.getState().authSession as string;
  return useQuery({
    queryKey: ['clans', communityId, 'available'],
    queryFn: () => getAvailableClans(communityId, language, authSession),
    enabled: !!communityId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Get clan info
 */
export const useClanInfo = (clanId: string) => {
  const language = LanguageStore.getState().language;
  const authSession = authStore.getState().authSession as string;
  return useQuery({
    queryKey: ['clan', clanId],
    queryFn: () => getClanInfo(clanId, language, authSession),
    enabled: !!clanId,
    staleTime: 2 * 60 * 1000,
  });
};

/**
 * Get clan members
 */
export const useClanMembers = (clanId: string) => {
  const language = LanguageStore.getState().language;
  const authSession = authStore.getState().authSession as string;
  return useQuery({
    queryKey: ['clan', clanId, 'members'],
    queryFn: () => getClanMembers(clanId, language, authSession),
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
  const authSession = authStore.getState().authSession as string;
  return useMutation({
    mutationFn: (payload: CreateClanPayload) => createClan(payload, language, authSession),
    onSuccess: (data, variables) => {
      // Invalidate clans list for the specific community
      queryClient.invalidateQueries({
        queryKey: ['clans', variables.communityId],
      });
      queryClient.invalidateQueries({
        queryKey: ['clans', variables.communityId, 'joined'],
      });
      queryClient.invalidateQueries({
        queryKey: ['clans', variables.communityId, 'available'],
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
  const authSession = authStore.getState().authSession as string;
  return useMutation({
    mutationFn: (clanId: string) => joinClan(language, clanId, authSession),
    onSuccess: () => {
      // Invalidate queries to refresh clan data
      queryClient.invalidateQueries({ queryKey: ['clans'] });
      queryClient.invalidateQueries({ queryKey: ['clan'] });
      queryClient.invalidateQueries({ queryKey: ['joinedClans'] });
      queryClient.invalidateQueries({ queryKey: ['availableClans'] });
    },
  });
};

/**
 * Join private clan with code mutation
 */
export const useJoinClanWithCode = () => {
  const queryClient = useQueryClient();
  const language = LanguageStore.getState().language;
  const authSession = authStore.getState().authSession as string;
  return useMutation({
    mutationFn: ({ clanId, inviteCode }: { clanId: string; inviteCode: string }) =>
      joinClanWithCode(language, clanId, inviteCode, authSession),
    onSuccess: () => {
      // Invalidate queries to refresh clan data
      queryClient.invalidateQueries({ queryKey: ['clans'] });
      queryClient.invalidateQueries({ queryKey: ['clan'] });
      queryClient.invalidateQueries({ queryKey: ['joinedClans'] });
      queryClient.invalidateQueries({ queryKey: ['availableClans'] });
    },
  });
};

/**
 * Leave clan mutation
 */
export const useLeaveClan = () => {
  const queryClient = useQueryClient();
  const language = LanguageStore.getState().language;
  const authSession = authStore.getState().authSession as string;
  return useMutation({
    mutationFn: (clanId: string) => leaveClan(clanId, language, authSession),
    onSuccess: () => {
      // Invalidate queries to refresh clan data
      queryClient.invalidateQueries({ queryKey: ['clans'] });
      queryClient.invalidateQueries({ queryKey: ['clan'] });
      queryClient.invalidateQueries({ queryKey: ['joinedClans'] });
      queryClient.invalidateQueries({ queryKey: ['availableClans'] });
    },
  });
};

/**
 * Delete clan mutation
 */
export const useDeleteClan = () => {
  const queryClient = useQueryClient();
  const language = LanguageStore.getState().language;
  const authSession = authStore.getState().authSession as string;
  return useMutation({
    mutationFn: (clanId: string) => deleteClan(clanId, language, authSession),
    onSuccess: () => {
      // Invalidate queries to refresh clan data
      queryClient.invalidateQueries({ queryKey: ['clans'] });
      queryClient.invalidateQueries({ queryKey: ['joinedClans'] });
      queryClient.invalidateQueries({ queryKey: ['availableClans'] });
    },
  });
};
