/**
 * Get current user's profile
 */
// export const useUserProfile = () => {
//   return useQuery({
//     queryKey: ["userProfile"],
//     queryFn: () => getProfile(),
//     staleTime: 5 * 60 * 1000, // 5 minutes
//   });
// };

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
