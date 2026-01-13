import axiosInstance from '../client';
import { CreateCommunityDto } from '../generated';

export interface Community {
  id: string;
  name: string;
  description: string;
  photo: string | null;
  currentMembers: number;
  maxMembers: number;
  isPrivate: boolean;
  userRole: 'ADMIN' | 'MEMBER';
  isPinned: boolean;
}

export interface GetMyCommunitiesResponse {
  statusCode: number;
  body: {
    message: string;
    data: Community[];
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
  total: number;
  hasMore: boolean;
}

export const communitiesService = {
  /**
   * Get community by ID
   */
  getById: async (id: string): Promise<Community> => {
    const { data } = await axiosInstance.get<Community>(`/communities/${id}`);
    return data;
  },

  /**
   * Join a community
   */
  join: async (id: string): Promise<void> => {
    await axiosInstance.post(`/communities/${id}/join`);
  },

  /**
   * Leave a community
   */
  leave: async (id: string): Promise<void> => {
    await axiosInstance.post(`/communities/${id}/leave`);
  },

  /**
   * Get community members
   */
  getMembers: async (id: string): Promise<any[]> => {
    const { data } = await axiosInstance.get(`/communities/${id}/members`);
    return data;
  },

  /**
   * Update community settings (admin only)
   */
  updateSettings: async (id: string, payload: Partial<CreateCommunityDto>): Promise<Community> => {
    const { data } = await axiosInstance.patch<Community>(`/communities/${id}`, payload);
    return data;
  },

  /**
   * Delete community (admin only)
   */
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/communities/${id}`);
  },
};
