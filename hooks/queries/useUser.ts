import { getMe } from '@/api/endPoints/user';
import authStore from '@/stores/auth.store';
import LanguageStore from '@/stores/language.store';
import { useQuery } from '@tanstack/react-query';
export const useUserProfile = () => {
  const language = LanguageStore.getState().language;
  const authSession = authStore.getState().authSession as string;
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: () => getMe(language, authSession),
    staleTime: 5 * 60 * 1000, 
  });
};

/**
 * Update user profile mutation
 */
// export const useUpdateProfile = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (payload: UpdateProfileDto) =>
//       userService.updateProfile(payload),
//     onSuccess: (data) => {
//       // Update cached profile
//       queryClient.setQueryData(["userProfile"], data);

//       // Invalidate related queries
//       queryClient.invalidateQueries({ queryKey: ["userProfile"] });
//       queryClient.invalidateQueries({ queryKey: ["userStats"] });
//     },
//   });
// };

/**
 * Delete account mutation
 */
// export const useDeleteAccount = () => {
//   const queryClient = useQueryClient();
//   const logout = authStore((state) => state.logout);

//   return useMutation({
//     mutationFn: () => userService.deleteAccount(),
//     onSuccess: () => {
//       // Clear all cached data
//       queryClient.clear();

//       // Logout user
//       logout();
//     },
//   });
// };
