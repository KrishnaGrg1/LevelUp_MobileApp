import { login, registerUser, requestPasswordReset, resetPasswordWithOtp, VerifyUser } from '@/api/endPoints/auth.service';
import { User } from '@/api/generated';
import { ForgetPasswordInput } from '@/schemas/auth/forgetPassword';
import { LoginInput } from '@/schemas/auth/login';
import { RegisterInput } from '@/schemas/auth/register';
import { ResetPasswordAPIInput } from '@/schemas/auth/resetPassword';
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

    onSuccess: (data) => {
      console.log("Login success:", data);
      
      // Get store actions
      const { setAuthenticated } = authStore.getState();
      
      // store tokens, navigate, etc.
      setAuthenticated(true);


      router.replace('/(main)/dashboard');
    },

    onError: (error: any) => {
      console.log("Login failed:", error.message);
    },
  });
}


export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterInput) => {
      const language = LanguageStore.getState().language;
      return registerUser(data, language);
    },

    onSuccess: (data) => {
      console.log("Register success:", data);

      router.replace('/(auth)/verifyEmail');
    },

    onError: (error: any) => {
      console.log("Register failed:", error.message);
    },
  });
}

export function useForgetPassword() {
  return useMutation({
    mutationFn: (data: ForgetPasswordInput) => {
      const language = LanguageStore.getState().language;
      return requestPasswordReset(data.email, language);
    },

    onSuccess: (data) => {
      console.log("Forget password success:", data);
      const { setUser } = authStore.getState(); 
      setUser({ id: String(data.body.data.userId) } as User);
      router.push('/(auth)/resetPassword');
    },

    onError: (error: any) => {
      console.log("Forget password failed:", error.message);
    },
  });
}


export function useResetPassword() {
  return useMutation({
    mutationFn: (data: ResetPasswordAPIInput) => {
      const language = LanguageStore.getState().language;
      return resetPasswordWithOtp(data, language);
    },

    onSuccess: (data) => {
       const { logout } = authStore.getState(); 
       logout();
      console.log("Reset password success:", data);
      router.push('/(auth)/login');
    },

    onError: (error: any) => {
      console.log("Reset password failed:", error.message);
    },
  });
}


export function useVerifyEmail() {
  return useMutation({
    mutationFn: (data: VerifyInput) => {
      const language = LanguageStore.getState().language;
      return VerifyUser(data, language);
    },

    onSuccess: (data) => {
      console.log("Reset password success:", data);
      router.push('/(auth)/login');
    },

    onError: (error: any) => {
      console.log("Reset password failed:", error.message);
    },
  });
}