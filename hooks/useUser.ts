// hooks/useUser.ts
import { changePassword, deleteUser, editProfile, getMe } from '@/api/endPoints/user';
import authStore from '@/stores/auth.store';
import LanguageStore from '@/stores/language.store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetMe = () => {
  const authSession = authStore.getState().authSession as string;
  const language = LanguageStore.getState().language;
  return useQuery({
    queryKey: ['get-me'], // Query updates when language changes
    queryFn: () => getMe(language!, authSession!),
    enabled: !!authSession, // Only run when both exist
    // Don't refetch on language change to avoid cascading effects
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const useChangePassword = () => {
  const queryClient = useQueryClient();
  const language = LanguageStore.getState().language;

  return useMutation({
    mutationFn: (data: {
      currentPassword: string;
      newPassword: string;
      confirmNewPassword: string;
    }) => {
      const lang = LanguageStore.getState().language;
      const authSession = authStore.getState().authSession as string;
      return changePassword(data, lang, authSession);
    },

    onSuccess: (_data, variables) => {
      // No need to update user in store - password change is handled server-side
      // Just invalidate the query to potentially refresh user data if needed
      queryClient.invalidateQueries({
        queryKey: ['get-me'],
      });
    },
  });
};

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: () => {
      const lang = LanguageStore.getState().language;
      const authSession = authStore.getState().authSession as string;
      return deleteUser(lang, authSession);
    },

    onSuccess: data => {},
  });
};

export const useEditProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { username: string }) => {
      const lang = LanguageStore.getState().language;
      const authSession = authStore.getState().authSession as string;
      return editProfile(data, lang, authSession);
    },

    onSuccess: (_data, variables) => {
      // Update username in auth store
      const setUser= authStore.getState().setUser
      const user= authStore.getState().user
      if (user) {
        setUser({
          ...user,
          UserName: variables.username,
        });
        console.log('Username change to:', variables.username);
      }
      console.log('user', user);
      // Invalidate the query to refresh user data
      queryClient.invalidateQueries({
        queryKey: ['get-me'],
      });

    },
  });
};
