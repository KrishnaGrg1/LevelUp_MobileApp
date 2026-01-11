import {
  createCommunity,
  getMyCommunities,
  joinCommunity,
  joinPrivateCommunity,
  searchCommunities,
} from "@/api/endPoints/communities";
import { communitiesService } from "@/api/endPoints/communities.service";

import { CreateCommunityDto } from "@/api/generated";

import LanguageStore from "@/stores/language.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
/**
 * Get user's joined communities
 */
export const useMyCommunities = () => {
  const language = LanguageStore.getState().language;
  return useQuery({
    queryKey: ["userCommunities"],

    queryFn: () => getMyCommunities(language),
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
};

/**
 * Search communities
 */
export const useSearchCommunities = (searchQuery: string) => {
  const language = LanguageStore.getState().language;
  return useQuery({
    queryKey: ["search-communities", searchQuery],
    queryFn: () => searchCommunities(language, searchQuery),
    enabled: searchQuery.length > 0,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

/**
 * Get community by ID
 */
export const useCommunity = (id: string) => {
  return useQuery({
    queryKey: ["communities", id],
    queryFn: () => communitiesService.getById(id),
    enabled: !!id,
    staleTime: 3 * 60 * 1000,
  });
};

/**
 * Get community members
 */
export const useCommunityMembers = (id: string) => {
  return useQuery({
    queryKey: ["communities", id, "members"],
    queryFn: () => communitiesService.getMembers(id),
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

  return useMutation({
    mutationFn: (payload: FormData) => createCommunity(language, payload),
    onSuccess: () => {
      // Invalidate communities list
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      queryClient.invalidateQueries({ queryKey: ["userCommunities"] });
    },
  });
};

/**
 * Join Private community mutation
 */
export const useJoinPrivateCommunity = () => {
  const queryClient = useQueryClient();
  const language = LanguageStore.getState().language;

  return useMutation({
    mutationFn: (joinCode: string) => joinPrivateCommunity(language, joinCode),
    onSuccess: () => {
      // Refresh the user's community list so the new one shows up
      queryClient.invalidateQueries({ queryKey: ["userCommunities"] });
      queryClient.invalidateQueries({ queryKey: ["communities"] });
    },
  });
};

/**
 * Join Public community mutation
 */
export const useJoinCommunity = () => {
  const queryClient = useQueryClient();
  const language = LanguageStore.getState().language;

  return useMutation({
    mutationFn: (communityId: string) => joinCommunity(language, communityId),
    onSuccess: () => {
      // Refresh the user's community list
      queryClient.invalidateQueries({ queryKey: ["userCommunities"] });
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      queryClient.invalidateQueries({ queryKey: ["search-communities"] });
    },
  });
};

/**
 * Leave community mutation
 */
// export const useLeaveCommunity = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (id: string) => communitiesService.leave(id),
//     onMutate: async (id) => {
//       await queryClient.cancelQueries({ queryKey: ["communities", id] });

//       const previousCommunity = queryClient.getQueryData<Community>([
//         "communities",
//         id,
//       ]);

//       if (previousCommunity) {
//         queryClient.setQueryData<Community>(["communities", id], {
//           ...previousCommunity,
//           currentMembers: previousCommunity.currentMembers - 1,
//         });
//       }

//       return { previousCommunity };
//     },
//     onError: (err, id, context) => {
//       if (context?.previousCommunity) {
//         queryClient.setQueryData(
//           ["communities", id],
//           context.previousCommunity
//         );
//       }
//     },
//     onSettled: (data, error, id) => {
//       queryClient.invalidateQueries({ queryKey: ["communities", id] });
//       queryClient.invalidateQueries({ queryKey: ["userCommunities"] });
//       queryClient.invalidateQueries({ queryKey: ["userStats"] });
//     },
//   });
// };

/**
 * Update community mutation (admin only)
 */
export const useUpdateCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CreateCommunityDto>;
    }) => communitiesService.updateSettings(id, payload),
    onSuccess: (data, { id }) => {
      queryClient.setQueryData(["communities", id], data);
      queryClient.invalidateQueries({ queryKey: ["communities"] });
    },
  });
};

/**
 * Delete community mutation (admin only)
 */
export const useDeleteCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => communitiesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      queryClient.invalidateQueries({ queryKey: ["userCommunities"] });
    },
  });
};
