import { Language } from '@/stores/language.store';
import axiosInstance from '../client';
import type {
  DeleteUserResponse,
  GetAllUsersResponse,
  GetMeResponse,
  changePasswordResponse,
  fullUserObjectResponse,
} from '../generated';

export const getMe = async (lang: Language, sessionCookie: string) => {
  try {
    const response = await axiosInstance.get<GetMeResponse>(`/auth/me`, {
      withCredentials: true,
      headers: {
        'X-Language': lang,
        Authorization: `Bearer ${sessionCookie}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { body?: { message?: string }; message?: string } };
    };
    const errorMessage =
      err.response?.data?.body?.message || err.response?.data?.message || 'Login failed';
    throw new Error(errorMessage);
  }
};

export const getAllUsers = async (lang: Language, pramas: URLSearchParams) => {
  try {
    const response = await axiosInstance.get<GetAllUsersResponse>(`/admin/users/all`, {
      withCredentials: true,
      headers: {
        'X-Language': lang,
      },
      params: pramas,
    });
    return response.data;
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { body?: { message?: string }; message?: string } };
    };
    const errorMessage =
      err.response?.data?.body?.message || err.response?.data?.message || 'Login failed';
    throw new Error(errorMessage);
  }
};

export const changePassword = async (
  data: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  },
  lang: Language,
  authSession: string,
) => {
  try {
    const response = await axiosInstance.post<changePasswordResponse>(
      `/auth/change-password`,
      data,
      {
        withCredentials: true,
        headers: {
          'X-Language': lang,
          Authorization: `Bearer ${authSession}`,
        },
      },
    );
    return response.data;
  } catch (error: unknown) {
    const err = error as {
      response?: {
        data?: {
          body?: { message?: string; error?: string };
          message?: string;
          error?: string;
        };
      };
    };
    const errorMessage =
      err.response?.data?.body?.message || err.response?.data?.message || 'Change password failed';
    const errorDetail = err.response?.data?.body?.error || err.response?.data?.error;

    throw { message: errorMessage, error: errorDetail };
  }
};

// Get user by ID
export const getUserById = async (lang: Language, userId: string) => {
  try {
    const response = await axiosInstance.get<fullUserObjectResponse>(`/admin/users/${userId}`, {
      withCredentials: true,
      headers: {
        'X-Language': lang,
      },
    });
    return response.data;
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { body?: { message?: string }; message?: string } };
    };
    const errorMessage =
      err.response?.data?.body?.message || err.response?.data?.message || 'Failed to fetch user';
    throw new Error(errorMessage);
  }
};

export const deleteUser = async (lang: Language, authSession: string) => {
  try {
    const response = await axiosInstance.delete<DeleteUserResponse>(`/auth/deleteAccount`, {
      withCredentials: true,
      headers: {
        'X-Language': lang,
        Authorization: `Bearer ${authSession}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { body?: { message?: string }; message?: string } };
    };
    const errorMessage =
      err.response?.data?.body?.message || err.response?.data?.message || 'Failed to delete user';
    throw new Error(errorMessage);
  }
};

export const editProfile = async (
  data: { username: string },
  lang: Language,
  authSession: string,
) => {
  try {
    const response = await axiosInstance.patch<DeleteUserResponse>(`/auth/editProfile`, data, {
      withCredentials: true,
      headers: {
        'X-Language': lang,
        Authorization: `Bearer ${authSession}`,
      },
    });
    console.log('edit profile ', response.data);
    return response.data;
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { body?: { message?: string }; message?: string } };
    };
    const errorMessage =
      err.response?.data?.body?.message || err.response?.data?.message || 'Failed to delete user';
    throw new Error(errorMessage);
  }
};
