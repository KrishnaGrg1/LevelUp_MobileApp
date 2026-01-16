import { Language } from '@/stores/language.store';
import axiosInstance from '../client';
import type {
  CompletedQuestsResponse,
  CompleteQuestResponse,
  DailyQuestsResponse,
  StartQuestResponse,
  WeeklyQuestsResponse,
} from '../types/ai';

export const fetchDailyQuests = async (lang: Language) => {
  try {
    const response = await axiosInstance.get<DailyQuestsResponse>('/ai/quests/daily', {
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
      'Failed to fetch daily quests';
    throw new Error(errorMessage);
  }
};

export const fetchWeeklyQuests = async (lang: Language) => {
  try {
    const response = await axiosInstance.get<WeeklyQuestsResponse>('/ai/quests/weekly', {
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
      'Failed to fetch weekly quests';
    throw new Error(errorMessage);
  }
};

export const generateDailyQuests = async (lang: Language) => {
  try {
    const response = await axiosInstance.post<DailyQuestsResponse>(
      '/ai/generate/daily',
      {},
      {
        headers: {
          'X-Language': lang,
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
      'Failed to generate daily quests';
    throw new Error(errorMessage);
  }
};

export const generateWeeklyQuests = async (lang: Language) => {
  try {
    const response = await axiosInstance.post<WeeklyQuestsResponse>(
      '/ai/generate/weekly',
      {},
      {
        headers: {
          'X-Language': lang,
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
      'Failed to generate weekly quests';
    throw new Error(errorMessage);
  }
};

export const startQuest = async (questId: string, lang: Language) => {
  try {
    const response = await axiosInstance.post<StartQuestResponse>(
      '/ai/quests/start',
      { questId },
      {
        headers: {
          'X-Language': lang,
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
      'Failed to start quest';
    throw new Error(errorMessage);
  }
};

export const completeQuest = async (questId: string, lang: Language) => {
  try {
    const response = await axiosInstance.patch<CompleteQuestResponse>(
      '/ai/quests/complete',
      { questId },
      {
        headers: {
          'X-Language': lang,
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
      'Failed to complete quest';
    throw new Error(errorMessage);
  }
};

export const fetchCompletedQuests = async (
  lang: Language,
  page: number = 1,
  limit: number = 20,
  type?: 'Daily' | 'Weekly',
) => {
  try {
    const params: Record<string, string | number> = { page, limit };
    if (type) {
      params.type = type;
    }

    const response = await axiosInstance.get<CompletedQuestsResponse>('/ai/quests/completed', {
      params,
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
      'Failed to fetch completed quests';
    throw new Error(errorMessage);
  }
};
