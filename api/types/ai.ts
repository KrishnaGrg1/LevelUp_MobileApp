// AI Chat Types
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIConfigResponse {
  statusCode: number;
  body: {
    message: string;
    data: {
      version: string;
      environment: string;
      ai: {
        configured: boolean;
        model: string | null;
        maxPromptChars: number;
        tokenCostPerChat: number;
      };
      quests: {
        dailyCount: number;
        weeklyCount: number;
        generationSchedule: {
          daily: string;
          weekly: string;
        };
        questsPerCommunity: number;
      };
      features: {
        aiChat: boolean;
        questGeneration: boolean;
        questCompletion: boolean;
        xpRewards: boolean;
      };
      user?: {
        tokens: number;
        timezone: string;
        totalQuests: number;
        completedQuests: number;
        communities: number;
      };
    };
  };
}

// AI Quest Types
export interface Quest {
  id: string;
  userId: string;
  communityId: string;
  description: string;
  xpValue: number;
  type: 'Daily' | 'Weekly';
  periodStatus:
    | 'TODAY'
    | 'YESTERDAY'
    | 'DAY_BEFORE_YESTERDAY'
    | 'THIS_WEEK'
    | 'LAST_WEEK'
    | 'TWO_WEEKS_AGO';
  periodKey: string;
  periodSeq: number;
  isCompleted?: boolean;
  startedAt?: string | null;
  completedAt?: string | null;
  estimatedMinutes?: number;
  date?: string;
  createdAt?: string;
  communityMemberId?: string | null;
  source?: string;
}

export type QuestStatus = 'not-started' | 'in-progress' | 'ready' | 'completed';

export interface TimeRemaining {
  isReady: boolean;
  remainingMinutes: number;
  remainingText: string;
  progressPercent: number;
}

export interface DailyQuestsResponse {
  statusCode: number;
  body: {
    message: string;
    data: {
      today: Quest[];
      yesterday: Quest[];
      dayBeforeYesterday: Quest[];
    };
  };
}

export interface WeeklyQuestsResponse {
  statusCode: number;
  body: {
    message: string;
    data: {
      thisWeek: Quest[];
      lastWeek: Quest[];
      twoWeeksAgo: Quest[];
    };
  };
}

export interface StartQuestResponse {
  statusCode: number;
  body: {
    message: string;
    data: {
      quest: Quest;
    };
  };
}

export interface CompleteQuestResponse {
  statusCode: number;
  body: {
    message: string;
    data: {
      quest: Quest;
      xpAwarded: number;
      currentXp: number;
      currentLevel: number;
      tokensAwarded?: number;
      currentTokens?: number;
      communityXp?: number;
      communityLevel?: number;
      communityId?: string;
      communityTotalXp?: number;
      clanMemberXp?: number;
      clanId?: string;
      clanTotalXp?: number;
    };
  };
}

export interface CompletedQuestsResponse {
  statusCode: number;
  body: {
    message: string;
    data: {
      quests: Quest[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasMore: boolean;
      };
    };
  };
}

// Socket Event Types
export interface TokenStatusData {
  hasTokens: boolean;
  currentTokens: number;
  costPerMessage?: number;
}

export interface ChatChunkData {
  chunk: string;
  index: number;
}

export interface ChatCompleteData {
  sessionId: string;
  response: string;
  tokensUsed: number;
  remainingTokens: number;
  responseTime: number;
}

export interface ChatErrorData {
  code: string;
  message: string;
  currentTokens?: number;
}

export interface ChatSendPayload {
  prompt: string;
  sessionId: string;
  conversationHistory: ChatMessage[];
}

export interface ChatCancelPayload {
  sessionId: string;
}
