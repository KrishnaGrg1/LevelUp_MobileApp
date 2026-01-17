import {
  login,
  logout,
  registerUser,
  requestPasswordReset,
  resetPasswordWithOtp,
  VerifyUser,
} from '@/api/endPoints/auth.service';
import { User } from '@/api/generated';
import { ForgetPasswordInput } from '@/schemas/auth/forgetPassword';
import { LoginInput } from '@/schemas/auth/login';
import { RegisterInput } from '@/schemas/auth/register';
import { VerifyInput } from '@/schemas/auth/verifyEmail';
import authStore from '@/stores/auth.store';
import LanguageStore from '@/stores/language.store';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginInput) => {
      const language = LanguageStore.getState().language;
      return login(data, language);
    },

    onSuccess: data => {
      console.log('Login success:', data);
      const { setAuthenticated, setAdminStatus, setAuthSession, setUser } = authStore.getState();

      const sessionToken =
        data?.body?.data?.authSession ||
        // Some backends return snake_case keys; handle both to avoid losing state
        (data as any)?.body?.data?.auth_session ||
        null;

      // Persist session first so downstream hooks have access to it
      setAuthSession(sessionToken ?? undefined);
      if (!sessionToken) {
        console.warn('Login succeeded but no auth session token was returned by the API.');
      }

      // Set authentication status
      setAuthenticated(true);
      // Set admin status from login response
      const isAdmin = data?.body?.data?.isadmin || false;
      setAdminStatus(isAdmin);
      if (data?.body?.data) {
        setUser({
          id: data.body.data.id,
          isAdmin: data.body.data.isadmin,
        } as User);
      }

      // Navigate to main dashboard (can be customized based on requirements)
      router.replace('/(main)/(tabs)/dashboard');
    },
    onError: (error: any) => {
      console.error('Login failed:', error);
      // Error is handled by the mutation error state
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterInput) => {
      const language = LanguageStore.getState().language;
      return registerUser(data, language);
    },

    onSuccess: data => {
      console.log('Register success:', data.body);
      const { setUser } = authStore.getState();

      // Set user data for verification flow
      setUser({ id: String(data.body.data.id) } as User);

      // Navigate to email verification
      router.replace('/(auth)/verifyEmail');
    },

    onError: (error: any) => {
      console.error('Register failed:', error);
      // Error is handled by the mutation error state
    },
  });
}

export function useForgetPassword() {
  return useMutation({
    mutationFn: (data: ForgetPasswordInput) => {
      const language = LanguageStore.getState().language;
      return requestPasswordReset(data.email, language);
    },

    onSuccess: data => {
      console.log('Forget password success:', data);
      const { setUser } = authStore.getState();

      // Store user ID for reset password flow
      setUser({ id: String(data.body.data.userId) } as User);

      // Navigate to reset password screen
      router.push('/(auth)/resetPassword');
    },

    onError: (error: any) => {
      console.error('Forget password failed:', error);
      // Error is handled by the mutation error state
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: { userId: string; otp: string; newPassword: string }) => {
      const language = LanguageStore.getState().language;
      return resetPasswordWithOtp(data, language);
    },

    onSuccess: data => {
      console.log('Reset password success:', data);
      const { logout } = authStore.getState();

      // Clear auth state
      logout();

      // Navigate to login screen
      router.push('/(auth)/login');
    },

    onError: (error: any) => {
      console.error('Reset password failed:', error);
      // Error is handled by the mutation error state
    },
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (data: VerifyInput) => {
      const language = LanguageStore.getState().language;
      return VerifyUser(data, language);
    },

    onSuccess: data => {
      console.log('Verify email success:', data);
      const { setAuthenticated, setAdminStatus } = authStore.getState();

      // Set authentication status
      setAuthenticated(true);

      // Set admin status if available in response
      const isAdmin = data?.body?.data?.isadmin || false;
      setAdminStatus(isAdmin);

      // Navigate to dashboard
      router.replace('/(main)/(tabs)/dashboard');
    },

    onError: (error: any) => {
      console.error('Verify email failed:', error);
      // Error is handled by the mutation error state
    },
  });
}

export function useLogOut() {
  return useMutation({
    mutationFn: () => {
      const language = LanguageStore.getState().language;
      const authSession = authStore.getState().authSession as string;
      return logout(language, authSession);
    },

    onSuccess: data => {
      const { logout } = authStore.getState();
      // Clear auth state
      logout();
      // Navigate to login screen
    },

    onError: (error: any) => {
      console.error('Verify email failed:', error);
      // Error is handled by the mutation error state
    },
  });
}
