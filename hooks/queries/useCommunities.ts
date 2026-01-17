import {
  createCommunity,
  deleteCommunity,
  getAllMembersOfCommunity,
  getInviteCode,
  getMyCommunities,
  joinCommunity,
  joinWithCodeCommunity,
  leaveCommunity,
  regenerateInviteCode,
  removeMember,
  searchCommunities,
  transferOwnership,
  updatecommunityById,
  uploadCommunityPhoto,
} from '@/api/endPoints/communities';

import { CreateCommunityDto } from '@/api/generated';
import authStore from '@/stores/auth.store';

import LanguageStore from '@/stores/language.store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
/**
 * Get user's joined communities
 */
export const useMyCommunities = () => {
  const language = LanguageStore.getState().language;
  const authSession = authStore.getState().authSession as string;
  return useQuery({
    queryKey: ['userCommunities'],

    queryFn: () => getMyCommunities(language, authSession),

    staleTime: 3 * 60 * 1000, // 3 minutes
  });
};

/**
 * Search communities
 */
export const useSearchCommunities = (searchQuery: string) => {
  const language = LanguageStore.getState().language;
  const authSession = authStore.getState().authSession as string;
  return useQuery({
    queryKey: ['search-communities', searchQuery],
    queryFn: () => searchCommunities(language, searchQuery, authSession),
    enabled: searchQuery.length > 0,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

/**
 * Get community by ID
 */
export const useCommunity = (id: string) => {
  const authSession = authStore.getState().authSession as string;
  const lang = LanguageStore.getState().language;
  return useQuery({
    queryKey: ['communities', id],
    queryFn: () => joinCommunity(lang, id, authSession),
    enabled: !!id,
    staleTime: 3 * 60 * 1000,
  });
};

/**
 * Get community members
 */
export const useCommunityMembers = (id: string) => {
  const authSession = authStore.getState().authSession;
  const lang = LanguageStore.getState().language;
  return useQuery({
    queryKey: ['communities', id, 'members'],
    queryFn: () => getAllMembersOfCommunity(id, lang, authSession as string),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
};

/**
 * Create community mutation
 */
export const useCreateCommunity = () => {
  const queryClient = useQueryClient();
  const language = LanguageStore.getState().language;
  const authSession = authStore.getState().authSession as string;
  return useMutation({
    mutationFn: (payload: FormData) => createCommunity(language, payload, authSession),
    onSuccess: () => {
      // Invalidate communities list
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      queryClient.invalidateQueries({ queryKey: ['userCommunities'] });
    },
  });
};

/**
 * Join With Code community mutation
 */
export const useJoinWithCodeCommunity = () => {
  const queryClient = useQueryClient();
  const language = LanguageStore.getState().language;
  const authSession = authStore.getState().authSession as string;
  return useMutation({
    mutationFn: (joinCode: string) => joinWithCodeCommunity(language, joinCode, authSession),
    onSuccess: () => {
      // Refresh the user's community list so the new one shows up
      queryClient.invalidateQueries({ queryKey: ['userCommunities'] });
      queryClient.invalidateQueries({ queryKey: ['communities'] });
    },
  });
};

/**
 * Join Public community mutation
 */
export const useJoinCommunity = () => {
  const queryClient = useQueryClient();
  const language = LanguageStore.getState().language;
  const authSession = authStore.getState().authSession as string;
  return useMutation({
    mutationFn: (communityId: string) => joinCommunity(language, communityId, authSession),
    onSuccess: () => {
      // Refresh the user's community list
      queryClient.invalidateQueries({ queryKey: ['userCommunities'] });
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      queryClient.invalidateQueries({ queryKey: ['search-communities'] });
    },
  });
};

/**
 * Leave community mutation
 */
export const useLeaveCommunity = () => {
  const queryClient = useQueryClient();
  const language = LanguageStore.getState().language;
  const authSession = authStore.getState().authSession as string;

  return useMutation({
    mutationFn: (communityId: string) => leaveCommunity(communityId, language, authSession),
    onSuccess: (data, communityId) => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['communities', communityId] });
      queryClient.invalidateQueries({ queryKey: ['userCommunities'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
    },
  });
};

/**
 * Update community mutation (admin only)
 */
export const useUpdateCommunity = () => {
  const queryClient = useQueryClient();
  const lang = LanguageStore.getState().language;
  const authSession = authStore.getState().authSession as string;
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateCommunityDto> }) =>
      updatecommunityById(lang, payload, id, authSession),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['community', id] });
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      queryClient.invalidateQueries({ queryKey: ['userCommunities'] });
    },
  });
};

/**
 * Delete community mutation (owner only)
 */
export const useDeleteCommunity = () => {
  const queryClient = useQueryClient();
  const language = LanguageStore.getState().language;
  const authSession = authStore.getState().authSession as string;

  return useMutation({
    mutationFn: (communityId: string) => deleteCommunity(communityId, language, authSession),
    onSuccess: (data, communityId) => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['community', communityId] });
      queryClient.invalidateQueries({ queryKey: ['userCommunities'] });
      queryClient.invalidateQueries({ queryKey: ['communities'] });
    },
  });
};

/**
 * Transfer ownership mutation (owner only)
 */
export const useTransferOwnership = () => {
  const queryClient = useQueryClient();
  const language = LanguageStore.getState().language;
  const authSession = authStore.getState().authSession as string;

  return useMutation({
    mutationFn: ({ communityId, newOwnerId }: { communityId: string; newOwnerId: string }) =>
      transferOwnership(communityId, newOwnerId, language, authSession),
    onSuccess: (data, { communityId }) => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['communities', communityId] });
      queryClient.invalidateQueries({ queryKey: ['userCommunities'] });
      queryClient.invalidateQueries({ queryKey: ['communities', communityId, 'members'] });
    },
  });
};

/**
 * Get invite code for a community
 */
export const useGetInviteCode = (communityId: string, enabled: boolean = false) => {
  const language = LanguageStore.getState().language;
  const authSession = authStore.getState().authSession as string;

  return useQuery({
    queryKey: ['community', communityId, 'invite-code'],
    queryFn: () => getInviteCode(communityId, language, authSession),
    enabled: enabled && !!communityId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Regenerate invite code for a community (owner only)
 */
export const useRegenerateInviteCode = () => {
  const queryClient = useQueryClient();
  const language = LanguageStore.getState().language;
  const authSession = authStore.getState().authSession as string;

  return useMutation({
    mutationFn: (communityId: string) => regenerateInviteCode(communityId, language, authSession),
    onSuccess: (data, communityId) => {
      // Invalidate the invite code query to refresh with new code
      queryClient.invalidateQueries({ queryKey: ['community', communityId, 'invite-code'] });
    },
  });
};

/**
 * Remove member from community (owner/admin only)
 */
export const useRemoveMember = () => {
  const queryClient = useQueryClient();
  const language = LanguageStore.getState().language;
  const authSession = authStore.getState().authSession as string;

  return useMutation({
    mutationFn: ({ communityId, memberId }: { communityId: string; memberId: string }) =>
      removeMember(communityId, memberId, language, authSession),
    onSuccess: (data, { communityId }) => {
      // Invalidate queries to refresh member list
      queryClient.invalidateQueries({ queryKey: ['community', communityId] });
      queryClient.invalidateQueries({ queryKey: ['communities', communityId] });
      queryClient.invalidateQueries({ queryKey: ['communities', communityId, 'members'] });
    },
  });
};

/**
 * Upload community photo (owner only)
 */
export const useUploadCommunityPhoto = () => {
  const queryClient = useQueryClient();
  const language = LanguageStore.getState().language;
  const authSession = authStore.getState().authSession as string;

  return useMutation({
    mutationFn: ({ communityId, photoFile }: { communityId: string; photoFile: FormData }) =>
      uploadCommunityPhoto(communityId, photoFile, language, authSession),
    onSuccess: (data, { communityId }) => {
      // Invalidate queries to refresh community data with new photo
      queryClient.invalidateQueries({ queryKey: ['community', communityId] });
      queryClient.invalidateQueries({ queryKey: ['communities', communityId] });
      queryClient.invalidateQueries({ queryKey: ['userCommunities'] });
    },
  });
};
