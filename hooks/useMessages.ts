import { getClanMessages, getCommunityMessages } from '@/api/endPoints/message.service';

import {
  getSocket,
  onClanMessage,
  onCommunityMessage,
  sendClanMessage,
  sendCommunityMessage,
} from '@/api/endPoints/socket';
import authStore from '@/stores/auth.store';
import LanguageStore from '@/stores/language.store';
import { Message } from '@/types/message.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { useRoom } from './useRoom';

interface UseMessagesProps {
  communityId?: string;
  clanId?: string;
  type: 'community' | 'clan';
}

/**
 * Hook for managing messages (CRUD + real-time)
 */
export const useMessages = ({ communityId, clanId, type }: UseMessagesProps) => {
  const language = LanguageStore.getState().language;
  const targetId = type === 'community' ? communityId : clanId;

  // Room management
  const { isJoined, isMember, accessDenied, accessDeniedCode } = useRoom({
    roomId: targetId,
    type,
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const hasInitializedRef = useRef(false);
  const queryClient = useQueryClient();

  // Unique room key for cache management
  const roomKey = `${type}-${targetId}`;
  const previousRoomKeyRef = useRef<string | null>(null);

  const queryKey = useMemo(
    () => [
      type === 'community' ? 'community-messages' : 'clan-messages',
      targetId,
      currentPage,
      language,
    ],
    [type, targetId, currentPage, language],
  );

  // Fetch initial messages
  const { data: initialMessages, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!targetId) return { messages: [], pagination: { hasMore: false } };

      return type === 'community'
        ? await getCommunityMessages(targetId, currentPage, 20, language)
        : await getClanMessages(targetId, currentPage, 20, language);
    },
    enabled: !!targetId && isJoined,
    staleTime: 0,
    gcTime: 0,
  });

  // Reset state when switching rooms
  useEffect(() => {
    if (previousRoomKeyRef.current !== roomKey) {
      console.log(`🔄 Room changed: ${previousRoomKeyRef.current} → ${roomKey}`);
      hasInitializedRef.current = false;
      setMessages([]);
      setCurrentPage(1);
      queryClient.invalidateQueries({ queryKey });
      previousRoomKeyRef.current = roomKey;
    }
  }, [roomKey, queryClient, queryKey]);

  // Initialize messages from API
  useEffect(() => {
    if (!initialMessages?.messages || hasInitializedRef.current) return;

    // Enrich messages with UserName if missing
    const enrichedMessages = initialMessages.messages.map((msg: any) => ({
      ...msg,
      UserName: msg.UserName || msg.sender?.UserName || 'Unknown User',
      userId: msg.userId || msg.senderId,
    }));

    setMessages(enrichedMessages);
    hasInitializedRef.current = true;
  }, [initialMessages, roomKey]);

  // Load more messages (pagination)
  const loadMore = useCallback(async () => {
    if (!targetId || !initialMessages?.pagination?.hasMore) return;

    const nextPage = currentPage + 1;

    try {
      const more =
        type === 'community'
          ? await getCommunityMessages(targetId, nextPage, 20, language)
          : await getClanMessages(targetId, nextPage, 20, language);

      setMessages(prev => {
        const existingIds = new Set(prev.map(m => m.id));

        // Enrich new messages with UserName if missing
        const enrichedNewMessages = more.messages
          .filter(m => !existingIds.has(m.id))
          .map((msg: any) => ({
            ...msg,
            UserName: msg.UserName || msg.sender?.UserName || 'Unknown User',
            userId: msg.userId || msg.senderId,
          }));

        return [...enrichedNewMessages, ...prev]; // Prepend older messages
      });
      setCurrentPage(nextPage);
    } catch (error) {
      console.error('Failed to load more messages:', error);
      Alert.alert('Error', 'Failed to load more messages');
    }
  }, [targetId, initialMessages, currentPage, type, language]);

  // Listen for new messages via socket
  useEffect(() => {
    if (!targetId || !isJoined) return;

    const socket = getSocket();

    const handleMessage = (message: any) => {
      const belongs =
        type === 'community' ? message.communityId === targetId : message.clanId === targetId;

      if (!belongs) return;

      // Ensure UserName is present - check multiple sources
      const currentUser = authStore.getState().user;
      const enrichedMessage = {
        ...message,
        UserName:
          message.UserName || message.sender?.UserName || currentUser?.UserName || 'Unknown User',
        userId: message.userId || message.senderId,
      };

      setMessages(prev => {
        if (prev.some(m => m.id === enrichedMessage.id)) return prev;
        console.log('🔌 New message received via socket:', enrichedMessage);
        return [...prev, enrichedMessage]; // Append new message
      });
    };

    if (type === 'community') {
      onCommunityMessage(handleMessage);
    } else {
      onClanMessage(handleMessage);
    }

    return () => {
      socket.off(type === 'community' ? 'community:new-message' : 'clan:new-message');
    };
  }, [targetId, type, isJoined, roomKey]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!targetId) throw new Error('No target ID');

      console.log('📤 Sending message');

      if (type === 'community') {
        sendCommunityMessage(targetId, content);
      } else {
        sendClanMessage(targetId, content);
      }

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: error => {
      console.error('❌ Failed to send message:', error);
      Alert.alert('Error', 'Failed to send message');
    },
  });

  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim()) {
        Alert.alert('Error', 'Message cannot be empty');
        return;
      }
      if (!isJoined) {
        Alert.alert('Error', 'Not connected to room');
        return;
      }
      if (!isMember) {
        Alert.alert('Error', 'You are not a member');
        return;
      }

      sendMessageMutation.mutate(content);
    },
    [sendMessageMutation, isJoined, isMember],
  );

  return {
    messages,
    sendMessage,
    isLoading,
    isSending: sendMessageMutation.isPending,
    loadMore,
    hasMore: initialMessages?.pagination?.hasMore || false,
    isJoined,
    isMember,
    accessDenied,
    accessDeniedCode,
  };
};
