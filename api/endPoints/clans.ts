import { Language } from '@/stores/language.store';
import axiosInstance from '../client';

// Clan interface matching backend response
export interface ClanOwner {
  id: string;
  UserName: string;
  email: string;
  profilePicture: string | null;
  xp: number;
  level: number;
  isVerified: boolean;
  isAdmin: boolean;
}

export interface ClanStats {
  battlesWon?: number;
  memberCount?: number;
}

export interface Clan {
  id: string;
  name: string;
  slug: string | null;
  isPrivate: boolean;
  xp: number;
  description: string | null;
  ownerId: string;
  communityId: string;
  limit: number;
  welcomeMessage: string | null;
  stats: ClanStats | null;
  createdAt: string;
  updatedAt: string;
  owner: ClanOwner;
  isMember?: boolean;
  _count?: {
    members: number;
  };
}

export interface ClanMember {
  id: string;
  userId: string;
  communityId: string;
  clanId: string | null;
  role: string;
  user: {
    id: string;
    UserName: string;
    email: string;
    profilePicture: string | null;
    xp: number;
    level: number;
    isVerified: boolean;
  };
}

// Member structure as returned by getClanInfo API
export interface ClanInfoMember {
  userId: string;
  joinedAt: string;
  user: {
    id: string;
    UserName: string;
  };
}

export interface ClanInfoResponse extends Clan {
  community: {
    id: string;
    name: string;
    isPrivate: boolean;
  };
  members: ClanInfoMember[];
  _count: {
    members: number;
  };
}

export interface GetClansResponse {
  statusCode: number;
  body: {
    message: string;
    data: Clan[];
  };
}

export interface GetClanInfoResponse {
  statusCode: number;
  body: {
    message: string;
    data: ClanInfoResponse;
  };
}

export interface GetClanMembersResponse {
  statusCode: number;
  body: {
    message: string;
    data: ClanMember[];
  };
}

export interface CreateClanPayload {
  name: string;
  communityId: string;
  description?: string;
  isPrivate?: boolean;
  limit?: number;
}

export interface ClanInfoDetailResponse {
  statusCode: number;
  body: {
    message: string;
    data: {
      id: string;
      name: string;
      slug: string;
      description: string | null;
      isPrivate: boolean;
      limit: number;
      xp: number;
      welcomeMessage: string;
      createdAt: string;
      ownerId: string;
      communityId: string;
      stats: {
        battlesWon: number;
        memberCount: number;
      };
      owner: {
        id: string;
        UserName: string;
      };
      community: {
        id: string;
        name: string;
        isPrivate: boolean;
      };
      members: {
        userId: string;
        joinedAt: string;
        user: {
          id: string;
          UserName: string;
        };
      }[];
      _count: {
        members: number;
      };
    };
  };
}
export interface UpdateClanPayload {
  name?: string;
  description?: string;
  isPrivate?: boolean;
  limit?: number;
}

// Get all clans for a community
export const getClansByCommunity = async (
  communityId: string,
  lang: Language,
  authSession: string,
) => {
  try {
    const response = await axiosInstance.get<GetClansResponse>(`/clan/${communityId}`, {
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
      err.response?.data?.body?.message || err.response?.data?.message || 'Failed to fetch clans';
    throw new Error(errorMessage);
  }
};

// Create a new clan
export const createClan = async (
  payload: CreateClanPayload,
  lang: Language,
  authSession: string,
) => {
  try {
    const response = await axiosInstance.post<{
      statusCode: number;
      body: { message: string; data: Clan };
    }>('/clan/create', payload, {
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
      err.response?.data?.body?.message || err.response?.data?.message || 'Failed to create clan';
    throw new Error(errorMessage);
  }
};

// Join a clan
export const joinClan = async (lang: Language, clanId: string, authSession: string) => {
  try {
    const response = await axiosInstance.post(
      '/clan/join',
      { clanId },
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
      err.response?.data?.body?.message || err.response?.data?.message || 'Failed to join clan';
    throw new Error(errorMessage);
  }
};

// Join a private clan with code
export const joinClanWithCode = async (
  lang: Language,
  clanId: string,
  inviteCode: string,
  authSession: string,
) => {
  try {
    const response = await axiosInstance.post(
      '/clan/requestJoin',
      { clanId, joinCode: inviteCode },
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
      'Failed to join private clan';
    throw new Error(errorMessage);
  }
};

// Leave a clan
export const leaveClan = async (clanId: string, lang: Language, authSession: string) => {
  try {
    const response = await axiosInstance.post(
      '/clan/leave',
      { clanId },
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
      err.response?.data?.body?.message || err.response?.data?.message || 'Failed to leave clan';
    throw new Error(errorMessage);
  }
};

// Delete a clan
export const deleteClan = async (clanId: string, lang: Language, authSession: string) => {
  try {
    const response = await axiosInstance.delete(`/clan/${clanId}`, {
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
      err.response?.data?.body?.message || err.response?.data?.message || 'Failed to delete clan';
    throw new Error(errorMessage);
  }
};

// Get clan members
export const getClanMembers = async (clanId: string, lang: Language, authSession: string) => {
  try {
    const response = await axiosInstance.get<GetClanMembersResponse>(`/clan/members/${clanId}`, {
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
      'Failed to fetch clan members';
    throw new Error(errorMessage);
  }
};

// Get clan info
export const getClanInfo = async (clanId: string, lang: Language, authSession: string) => {
  try {
    const response = await axiosInstance.get<ClanInfoDetailResponse>(`/clan/specific/${clanId}`, {
      withCredentials: true,
      headers: {
        'X-Language': lang,
        Authorization: `Bearer ${authSession}`,
      },
    });
    console.log('Get Clan Info Response:', response.data.body.data);
    return response.data;
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { body?: { message?: string }; message?: string } };
    };
    const errorMessage =
      err.response?.data?.body?.message ||
      err.response?.data?.message ||
      'Failed to fetch clan info';
    throw new Error(errorMessage);
  }
};

// Update clan
export const updateClan = async (
  clanId: string,
  payload: UpdateClanPayload,
  lang: Language,
  authSession: string,
) => {
  try {
    const response = await axiosInstance.put<{
      statusCode: number;
      body: { message: string; data: Clan };
    }>(`/clan/${clanId}`, payload, {
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
      err.response?.data?.body?.message || err.response?.data?.message || 'Failed to update clan';
    throw new Error(errorMessage);
  }
};

// Get user's clans
export const getUserClans = async (userId: string, lang: Language, authSession: string) => {
  try {
    const response = await axiosInstance.get(`/clan/user/${userId}`, {
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
      'Failed to fetch user clans';
    throw new Error(errorMessage);
  }
};

export const checkClanMembership = async (userId: string, clanId: string) => {
  try {
    const response = await axiosInstance.get(`/clan/checkMembership/${clanId}`, {
      withCredentials: true,
      params: { userId },
    });
    console.log('Check Clan Membership Response:', response.data);
    return response.data.body.data;
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { body?: { message?: string }; message?: string } };
    };
    const errorMessage =
      err.response?.data?.body?.message ||
      err.response?.data?.message ||
      'Failed to check clan membership';
    throw new Error(errorMessage);
  }
};

// Get joined clans for a community
export const getJoinedClans = async (communityId: string, lang: Language, authSession: string) => {
  try {
    const response = await axiosInstance.get<GetClansResponse>(`/clan/${communityId}/joined`, {
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
      'Failed to fetch joined clans';
    throw new Error(errorMessage);
  }
};

// Get available clans (not joined) for a community
export const getAvailableClans = async (
  communityId: string,
  lang: Language,
  authSession: string,
) => {
  try {
    const response = await axiosInstance.get<GetClansResponse>(`/clan/${communityId}/available`, {
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
      'Failed to fetch available clans';
    throw new Error(errorMessage);
  }
};
