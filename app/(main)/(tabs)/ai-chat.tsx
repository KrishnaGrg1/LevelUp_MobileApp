import React, { useEffect, useState } from 'react';
import { ActivityIndicator, TextInput } from 'react-native';

import {
  fetchAIChatHistory,
  fetchAITokenBalance,
  sendAIChat,
} from '@/api/endPoints/ai';
import { Box } from '@/components/ui/box';
import { Center } from '@/components/ui/center';
import { HStack } from '@/components/ui/hstack';
import { ScrollView } from '@/components/ui/scroll-view';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import authStore from '@/stores/auth.store';
import LanguageStore from '@/stores/language.store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Send } from 'lucide-react-native';
import { Pressable } from '@/components/ui/pressable';

export default function AIChatTab() {
  const language = LanguageStore.getState().language;
  const authSession = authStore.getState().authSession as string;
  const currentUserId = authStore.getState().user?.id;
  const queryClient = useQueryClient();

  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState<
    { id: string; role: 'user' | 'assistant'; text: string; createdAt: string }[]
  >([]);

  const {
    data: aiHistory,
    isLoading: isLoadingHistory,
    error: historyError,
  } = useQuery({
    queryKey: ['ai-chat-history', currentUserId, language],
    queryFn: () => fetchAIChatHistory(language as any, authSession, 1, 50),
    enabled: !!authSession && !!currentUserId,
  });

  const { data: tokenBalance } = useQuery({
    queryKey: ['ai-chat-tokens', currentUserId, language],
    queryFn: () => fetchAITokenBalance(language as any, authSession),
    enabled: !!authSession && !!currentUserId,
  });

  useEffect(() => {
    if (aiHistory?.body?.data?.history) {
      const normalized = aiHistory.body.data.history.flatMap(item => [
        {
          id: `${item.id}-u`,
          role: 'user' as const,
          text: item.prompt,
          createdAt: item.createdAt,
        },
        {
          id: `${item.id}-a`,
          role: 'assistant' as const,
          text: item.response,
          createdAt: item.createdAt,
        },
      ]);
      setAiMessages(normalized);
    }
  }, [aiHistory]);

  const aiChatMutation = useMutation({
    mutationFn: (prompt: string) => sendAIChat(prompt, language as any, authSession),
    onMutate: async prompt => {
      const tempId = `temp-${Date.now()}`;
      const userMessage = {
        id: `${tempId}-u`,
        role: 'user' as const,
        text: prompt,
        createdAt: new Date().toISOString(),
      };
      setAiMessages(prev => [...prev, userMessage]);
      return { tempId };
    },
    onSuccess: (data, _prompt, context) => {
      const replyText = data?.body?.data?.reply || 'No reply';
      const aiMessage = {
        id: `${context?.tempId}-a`,
        role: 'assistant' as const,
        text: replyText,
        createdAt: new Date().toISOString(),
      };
      setAiMessages(prev => [...prev, aiMessage]);
      queryClient.invalidateQueries({ queryKey: ['ai-chat-history', currentUserId, language] });
      queryClient.invalidateQueries({ queryKey: ['ai-chat-tokens', currentUserId, language] });
    },
  });

  return (
    <VStack className="flex-1 bg-background-0">
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingVertical: 12 }}
        showsVerticalScrollIndicator={false}
      >
        {tokenBalance?.body?.data ? (
          <Box className="mb-3 rounded-lg border border-outline-200 bg-background-50 p-3">
            <HStack className="items-center justify-between">
              <Text className="text-xs text-typography-500">Tokens</Text>
              <Text className="text-sm font-semibold text-typography-900">
                {tokenBalance.body.data.tokens}
              </Text>
            </HStack>
            <HStack className="mt-1 items-center justify-between">
              <Text className="text-xs text-typography-500">Cost / chat</Text>
              <Text className="text-xs text-typography-700">{tokenBalance.body.data.costPerChat}</Text>
            </HStack>
          </Box>
        ) : null}

        {isLoadingHistory ? (
          <Center className="py-10">
            <ActivityIndicator size="large" />
            <Text className="mt-3 text-sm text-typography-500">Loading AI chat...</Text>
          </Center>
        ) : historyError ? (
          <Center className="py-10">
            <Text className="text-center text-sm text-error-500">
              {historyError instanceof Error ? historyError.message : 'Failed to load chat'}
            </Text>
          </Center>
        ) : aiMessages.length === 0 ? (
          <Center className="py-10">
            <Text className="text-center text-typography-500">No AI messages yet. Ask something!</Text>
          </Center>
        ) : (
          <VStack space="md">
            {aiMessages.map(msg => (
              <Box
                key={msg.id}
                className={`max-w-[90%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'self-end bg-primary-600'
                    : 'self-start border border-outline-200 bg-background-50'
                }`}
              >
                <Text
                  className={`text-sm ${
                    msg.role === 'user' ? 'text-white' : 'text-typography-900'
                  }`}
                >
                  {msg.text}
                </Text>
                <Text
                  className={`mt-1 text-[10px] ${
                    msg.role === 'user' ? 'text-primary-100' : 'text-typography-400'
                  }`}
                >
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </Box>
            ))}
          </VStack>
        )}
      </ScrollView>

      <HStack
        space="md"
        className="items-center border-t border-outline-200 bg-background-0 px-4 py-3"
      >
        <Box className="flex-1 rounded-2xl border border-outline-200 bg-background-50 px-4 py-2">
          <TextInput
            placeholder="Ask the AI..."
            value={aiInput}
            onChangeText={setAiInput}
            placeholderTextColor="#9ca3af"
            className="min-h-[40px] text-sm text-typography-900"
            multiline
            editable={!aiChatMutation.isPending}
          />
        </Box>
        <Pressable
          onPress={() => {
            if (aiInput.trim()) {
              aiChatMutation.mutate(aiInput.trim());
              setAiInput('');
            }
          }}
          disabled={!aiInput.trim() || aiChatMutation.isPending}
          className={`h-10 w-10 items-center justify-center rounded-full ${
            !aiInput.trim() || aiChatMutation.isPending ? 'bg-typography-300' : 'bg-primary-600'
          }`}
        >
          {aiChatMutation.isPending ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Send size={18} color="#ffffff" />
          )}
        </Pressable>
      </HStack>
    </VStack>
  );
}
