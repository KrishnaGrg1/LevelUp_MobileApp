import { Language } from '@/stores/language.store';
import { MessagesResponse } from '@/types/message.types';
import axiosInstance from '../client';

/**
 * Fetch community messages (paginated)
 */
export const getCommunityMessages = async (
  communityId: string,
  page: number = 1,
  limit: number = 20,
  language: Language = 'eng',
): Promise<MessagesResponse> => {
  try {
    const response = await axiosInstance.get(`/community/${communityId}/messages`, {
      params: { page, limit },
      headers: { 'X-Language': language },
      withCredentials: true,
    });
    return response.data.body.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.body?.message || 'Failed to fetch community messages');
  }
};

/**
 * Fetch clan messages (paginated)
 */
export const getClanMessages = async (
  clanId: string,
  page: number = 1,
  limit: number = 20,
  language: Language = 'eng',
): Promise<MessagesResponse> => {
  try {
    const response = await axiosInstance.get(`/community/clan/${clanId}/messages`, {
      params: { page, limit },
      headers: { 'X-Language': language },
      withCredentials: true,
    });
    return response.data.body.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.body?.message || 'Failed to fetch clan messages');
  }
};

/**
 * Check if user is a clan member
 */
export const checkClanMembership = async (
  userId: string,
  clanId: string,
  language: Language = 'eng',
): Promise<{ isMember: boolean }> => {
  try {
    const response = await axiosInstance.get(`/community/clan/${clanId}/membership/${userId}`, {
      headers: { 'X-Language': language },
      withCredentials: true,
    });
    return response.data.body.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.body?.message || 'Failed to check clan membership');
  }
};
