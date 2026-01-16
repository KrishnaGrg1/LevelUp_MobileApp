import { io, Socket } from 'socket.io-client';
import { Message } from '../generated';
import type {
  ChatCancelPayload,
  ChatChunkData,
  ChatCompleteData,
  ChatErrorData,
  ChatSendPayload,
  TokenStatusData,
} from '../types/ai';

interface AuthSocket extends Socket {
  auth: {
    token?: string;
    userId?: string;
  };
  data: {
    userId?: string;
  };
}

let socket: AuthSocket | null = null;

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:8080';

export const getSocket = (): AuthSocket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      transports: ['websocket', 'polling'],
    }) as AuthSocket;

    // Socket connection event handlers
    socket.on('connect', () => {
      console.log('✅ Socket Connected:', socket?.id);
    });

    socket.on('disconnect', reason => {
      console.log('❌ Socket Disconnected:', reason);
    });

    socket.on('connect_error', error => {
      console.error('❌ Socket Connection error:', error.message);
    });

    socket.on('reconnect', attemptNumber => {
      console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
    });

    socket.on('reconnect_error', error => {
      console.error('❌ Socket reconnection error:', error.message);
    });

    socket.on('reconnect_failed', () => {
      console.error('❌ Socket reconnection failed');
    });
  }

  return socket;
};

export const connectSocket = (authToken?: string, userId?: string) => {
  const socket = getSocket();

  if (authToken) {
    socket.auth = { token: authToken };
  }

  if (userId) {
    socket.data = { userId: userId };
  }

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
    // Don't set socket to null to maintain reference for reconnection
  }
};

// Community room management
export const joinCommunity = (communityId: string) => {
  const socket = getSocket();
  socket.emit('join-community', { communityId });
  console.log('📥 Joined community');
};

export const leaveCommunity = (communityId: string) => {
  const socket = getSocket();
  socket.emit('leave-community', { communityId });
};

export const sendCommunityMessage = (communityId: string, content: string) => {
  const socket = getSocket();
  socket.emit('community:send-message', { communityId, content });
};

export const joinClan = (clanId: string) => {
  const socket = getSocket();
  socket.emit('join-clan', { clanId });
  console.log('📥 Joined clan');
};

export const leaveClan = (clanId: string) => {
  const socket = getSocket();
  socket.emit('leave-clan', { clanId });
};

export const sendClanMessage = (clanId: string, content: string) => {
  const socket = getSocket();
  socket.emit('clan:send-message', { clanId, content });
};

// Message event listeners
export const onNewMessage = (callback: (message: Message) => void) => {
  const socket = getSocket();
  socket.on('new-message', callback);
};

export const offNewMessage = () => {
  const socket = getSocket();
  socket.off('new-message');
};

export const onCommunityMessage = (callback: (message: Message) => void) => {
  const socket = getSocket();
  socket.on('community:new-message', callback);
};

export const offCommunityMessage = () => {
  const socket = getSocket();
  socket.off('community:new-message');
};

export const onClanMessage = (callback: (message: Message) => void) => {
  const socket = getSocket();
  socket.on('clan:new-message', callback);
};

export const offClanMessage = () => {
  const socket = getSocket();
  socket.off('clan:new-message');
};

// Typing indicator events
export const sendTyping = (roomId: string, isTyping: boolean) => {
  const socket = getSocket();
  socket.emit('typing', { roomId, isTyping });
};

export const onTyping = (
  callback: (data: { userId: string; userName: string; isTyping: boolean }) => void,
) => {
  const socket = getSocket();
  socket.on('user-typing', callback);
};

export const offTyping = () => {
  const socket = getSocket();
  socket.off('user-typing');
};

// User Presence
export const onUserJoined = (callback: (data: { userId: string; userName: string }) => void) => {
  const socket = getSocket();
  socket.on('user-joined', callback);
};

export const onUserLeft = (callback: (data: { userId: string; userName: string }) => void) => {
  const socket = getSocket();
  socket.on('user-left', callback);
};

// ========== AI CHAT FUNCTIONALITY ==========

// Check token balance
export const checkAIChatTokens = () => {
  const socket = getSocket();
  socket.emit('ai-chat:check-tokens');
};

// Send AI chat message
export const sendAIChatMessage = (payload: ChatSendPayload) => {
  const socket = getSocket();
  socket.emit('ai-chat:send', payload);
};

// Cancel AI chat
export const cancelAIChat = (payload: ChatCancelPayload) => {
  const socket = getSocket();
  socket.emit('ai-chat:cancel', payload);
};

// AI Chat event listeners
export const onAIChatTokenStatus = (callback: (data: TokenStatusData) => void) => {
  const socket = getSocket();
  socket.on('ai-chat:token-status', callback);
};

export const offAIChatTokenStatus = () => {
  const socket = getSocket();
  socket.off('ai-chat:token-status');
};

export const onAIChatStart = (callback: () => void) => {
  const socket = getSocket();
  socket.on('ai-chat:start', callback);
};

export const offAIChatStart = () => {
  const socket = getSocket();
  socket.off('ai-chat:start');
};

export const onAIChatChunk = (callback: (data: ChatChunkData) => void) => {
  const socket = getSocket();
  socket.on('ai-chat:chunk', callback);
};

export const offAIChatChunk = () => {
  const socket = getSocket();
  socket.off('ai-chat:chunk');
};

export const onAIChatComplete = (callback: (data: ChatCompleteData) => void) => {
  const socket = getSocket();
  socket.on('ai-chat:complete', callback);
};

export const offAIChatComplete = () => {
  const socket = getSocket();
  socket.off('ai-chat:complete');
};

export const onAIChatCancelled = (callback: () => void) => {
  const socket = getSocket();
  socket.on('ai-chat:cancelled', callback);
};

export const offAIChatCancelled = () => {
  const socket = getSocket();
  socket.off('ai-chat:cancelled');
};

export const onAIChatTokens = (callback: (data: { tokens: number }) => void) => {
  const socket = getSocket();
  socket.on('ai-chat:tokens', callback);
};

export const offAIChatTokens = () => {
  const socket = getSocket();
  socket.off('ai-chat:tokens');
};

export const onAIChatError = (callback: (error: ChatErrorData) => void) => {
  const socket = getSocket();
  socket.on('ai-chat:error', callback);
};

export const offAIChatError = () => {
  const socket = getSocket();
  socket.off('ai-chat:error');
};
