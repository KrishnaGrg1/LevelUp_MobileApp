import { Language } from '@/stores/language.store';
import axiosInstance from '../client';
import type { AIConfigResponse } from '../types/ai';

export const fetchAIConfig = async (lang: Language) => {
  try {
    const response = await axiosInstance.get<AIConfigResponse>('/ai/config', {
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
      err.response?.data?.body?.message ||
      err.response?.data?.message ||
      'Failed to fetch AI config';
    throw new Error(errorMessage);
  }
};
