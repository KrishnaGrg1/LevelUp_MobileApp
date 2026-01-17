import { Language } from '@/stores/language.store';
import axiosInstance from '../client';
import {
  communityDetailByIdResponse,
  CreateCommunityDto,
  CreateCommunityResponse,
  getCategoriesResponse,
  GetCommunityMembersSuccessResponse,
  GetInviteCodeResponse,
  GetMyCommunities,
  searchCommunitiesResponse,
  TogglePinResponse,
} from '../generated';

// Get user's communities
export const getMyCommunities = async (lang: Language, authSession: string) => {
  try {
    const response = await axiosInstance.get<GetMyCommunities>(`/community/my`, {
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
      err.response?.data?.body?.message ||
      err.response?.data?.message ||
      'Get My Communities failed';
    throw new Error(errorMessage);
  }
};

// Get all communities
export const getAllCommunities = async (lang: Language, authSession: string) => {
  try {
    const response = await axiosInstance.get<GetMyCommunities>(`/community`, {
      withCredentials: true,
      params: { page: 1 },
      headers: {
        'X-Language': lang,
        Authorization: `Bearer ${authSession}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    console.log('getAllCommunities Error:', error);
    const err = error as {
      response?: { data?: { body?: { message?: string }; message?: string }; status?: number };
    };
    if (err.response) {
       console.log('getAllCommunities Error Response Status:', err.response.status);
       console.log('getAllCommunities Error Response Data:', JSON.stringify(err.response.data));
    }
    const errorMessage =
      err.response?.data?.body?.message ||
      err.response?.data?.message ||
      'Get All Communities failed';
    throw new Error(errorMessage);
  }
};

// Create new community
export const togglePin = async (lang: Language, communityIds: string[], authSession: string) => {
  try {
    const response = await axiosInstance.post<TogglePinResponse>(
      `/community/toggle-pin`,
      { communityIds },
      {
        withCredentials: true,
        headers: {
          'X-Language': lang,
          Authorization: `Bearer ${authSession}`,
          'Content-Type': 'application/json',
        },
      },
    );
    console.log('Id are', communityIds);
    return response.data;
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { body?: { message?: string }; message?: string } };
    };
    const errorMessage =
      err.response?.data?.body?.message || err.response?.data?.message || 'To Community failed';
    throw new Error(errorMessage);
  }
};
// Create new community
export const createCommunity = async (lang: Language, formData: FormData, authSession: string) => {
  try {
    const response = await axiosInstance.post<CreateCommunityResponse>(
      `/community/create`,
      formData,
      {
        withCredentials: true,
        headers: {
          'X-Language': lang,
          Authorization: `Bearer ${authSession}`,
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { body?: { message?: string }; message?: string } };
    };
    const errorMessage =
      err.response?.data?.body?.message || err.response?.data?.message || 'Create Community failed';
    throw new Error(errorMessage);
  }
};

// Search  communities
export const searchCommunities = async (lang: Language, query: string, authSession: string) => {
  try {
    const response = await axiosInstance.get<searchCommunitiesResponse>(`/community/search`, {
      params: { q: query },
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
      err.response?.data?.body?.message ||
      err.response?.data?.message ||
      'Failed to search community';
    throw new Error(errorMessage);
  }
};

// Join a community
export const joinCommunity = async (lang: Language, communityId: string, authSession: string) => {
  try {
    const response = await axiosInstance.post<{
      success: boolean;
      message: string;
    }>(
      `/community/${communityId}/join`,
      {},
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
      response?: { data?: { body?: { message?: string }; message?: string } };
    };
    const errorMessage =
      err.response?.data?.body?.message ||
      err.response?.data?.message ||
      'Failed to join community';
    throw new Error(errorMessage);
  }
};

// Join a community with invite code
export const joinWithCodeCommunity = async (
  lang: Language,
  joinCode: string,
  authSession: string,
) => {
  try {
    const response = await axiosInstance.post<{
      success: boolean;
      message: string;
    }>(
      `/community/join`,
      { joinCode },
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
      response?: { data?: { body?: { message?: string }; message?: string } };
    };
    const errorMessage =
      err.response?.data?.body?.message ||
      err.response?.data?.message ||
      'Failed to join community';
    throw new Error(errorMessage);
  }
};

// Specific   Community Detail
export const communityDetailById = async (
  lang: Language,
  communityId: string,
  authSession: string,
) => {
  try {
    const response = await axiosInstance.get<communityDetailByIdResponse>(
      `/community/${communityId}`,
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
      response?: { data?: { body?: { message?: string }; message?: string } };
    };
    const errorMessage =
      err.response?.data?.body?.message ||
      err.response?.data?.message ||
      'Failed to search community';
    throw new Error(errorMessage);
  }
};

// Get Categories for communities

export const getCategories = async (lang: Language, authSession: string) => {
  try {
    const response = await axiosInstance.get<getCategoriesResponse>(`/auth/categories`, {
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
      err.response?.data?.body?.message ||
      err.response?.data?.message ||
      'Failed to get categories';
    throw new Error(errorMessage);
  }
};
// Get invite code for a community
export const getInviteCode = async (communityId: string, lang: Language, authSession: string) => {
  try {
    const response = await axiosInstance.get<GetInviteCodeResponse>(
      `/community/${communityId}/invite-code`,
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
      response?: { data?: { body?: { message?: string }; message?: string } };
    };
    const errorMessage =
      err.response?.data?.body?.message ||
      err.response?.data?.message ||
      'Failed to get invite code';
    throw new Error(errorMessage);
  }
};
export const getAllMembersOfCommunity = async (
  communityId: string,
  lang: Language,
  authSession: string,
) => {
  try {
    const response = await axiosInstance.get<GetCommunityMembersSuccessResponse>(
      `community/${communityId}/members`,
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
      response?: { data?: { body?: { message?: string }; message?: string } };
    };
    const errorMessage =
      err.response?.data?.body?.message ||
      err.response?.data?.message ||
      'Failed to get categories';
    throw new Error(errorMessage);
  }
};

export const updatecommunityById = async (
  lang: Language,
  payload: Partial<CreateCommunityDto>,
  communityId: string,
  authSession: string,
) => {
  try {
    const response = await axiosInstance.patch<communityDetailByIdResponse>(
      `/community/${communityId}`,
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
      response?: { data?: { body?: { message?: string }; message?: string } };
    };
    const errorMessage =
      err.response?.data?.body?.message ||
      err.response?.data?.message ||
      'Failed to search community';
    throw new Error(errorMessage);
  }
};

// Leave a community
export const leaveCommunity = async (communityId: string, lang: Language, authSession: string) => {
  try {
    const response = await axiosInstance.post(
      `/community/${communityId}/leave`,
      {},
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
      response?: { data?: { body?: { message?: string }; message?: string } };
    };
    const errorMessage =
      err.response?.data?.body?.message ||
      err.response?.data?.message ||
      'Failed to leave community';
    throw new Error(errorMessage);
  }
};

//Tranfer Ownership of a community

export const transferOwnership = async (
  communityId: string,
  newOwnerId: string,
  lang: Language,
  authSession: string,
) => {
  try {
    const response = await axiosInstance.post(
      `/community/${communityId}/transfer-ownership`,
      { newOwnerId },
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
      response?: { data?: { body?: { message?: string }; message?: string } };
    };
    const errorMessage =
      err.response?.data?.body?.message ||
      err.response?.data?.message ||
      'Failed to leave community';
    throw new Error(errorMessage);
  }
};

// Regenerate invite code for a community
export const regenerateInviteCode = async (
  communityId: string,
  lang: Language,
  authSession: string,
) => {
  try {
    const response = await axiosInstance.post(
      `/community/${communityId}/regenerate-invite-code`,
      {},
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
      response?: { data?: { body?: { message?: string }; message?: string } };
    };
    const errorMessage =
      err.response?.data?.body?.message ||
      err.response?.data?.message ||
      'Failed to regenerate invite code';
    throw new Error(errorMessage);
  }
};
