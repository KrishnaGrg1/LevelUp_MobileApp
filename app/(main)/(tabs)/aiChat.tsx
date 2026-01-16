import { fetchAIConfig } from '@/api/endPoints/ai-chat';
import {
  cancelAIChat,
  checkAIChatTokens,
  connectSocket,
  disconnectSocket,
  offAIChatCancelled,
  offAIChatChunk,
  offAIChatComplete,
  offAIChatError,
  offAIChatStart,
  offAIChatTokenStatus,
  onAIChatCancelled,
  onAIChatChunk,
  onAIChatComplete,
  onAIChatError,
  onAIChatStart,
  onAIChatTokenStatus,
  sendAIChatMessage,
} from '@/api/endPoints/socket';
import type { ChatMessage } from '@/api/types/ai';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Input, InputField } from '@/components/ui/input';
import { ScrollView } from '@/components/ui/scroll-view';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import authStore from '@/stores/auth.store';
import LanguageStore from '@/stores/language.store';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Platform } from 'react-native';

const AIChatScreen = () => {
  const language = LanguageStore(state => state.language);
  const user = authStore(state => state.user);
  
  // All hooks must be called in the same order every render
  const scrollViewRef = useRef<ScrollView>(null);
  const sessionIdRef = useRef(`session_${Date.now()}`);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [prompt, setPrompt] = useState('');
  const [tokens, setTokens] = useState(0);
  const [costPerMessage, setCostPerMessage] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  // Fetch AI config
  const { data: aiConfig } = useQuery({
    queryKey: ['ai-config', language],
    queryFn: () => fetchAIConfig(language),
  });

  // Setup socket connection
  useEffect(() => {
    if (!user) return;

    const socket = connectSocket(undefined, user.id);

    socket.on('connect', () => {
      setIsConnected(true);
      checkAIChatTokens();
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // AI Chat event handlers
    onAIChatTokenStatus(data => {
      setTokens(data.currentTokens);
      if (data.costPerMessage) {
        setCostPerMessage(data.costPerMessage);
      }
    });

    onAIChatStart(() => {
      setIsLoading(true);
      setStreamingResponse('');
    });

    onAIChatChunk(data => {
      setStreamingResponse(prev => prev + data.chunk);
    });

    onAIChatComplete(data => {
      setIsLoading(false);
      setChatHistory(prev => [...prev, { role: 'assistant', content: data.response }]);
      setTokens(data.remainingTokens);
      setStreamingResponse('');

      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    onAIChatCancelled(() => {
      setIsLoading(false);
      setStreamingResponse('');
      Alert.alert('Chat Cancelled', 'The AI response was cancelled.');
    });

    onAIChatError(error => {
      setIsLoading(false);
      setStreamingResponse('');

      switch (error.code) {
        case 'INSUFFICIENT_TOKENS':
          if (error.currentTokens !== undefined) {
            setTokens(error.currentTokens);
          }
          Alert.alert('Insufficient Tokens', error.message);
          break;
        case 'PROMPT_TOO_LONG':
          Alert.alert('Prompt Too Long', 'Please shorten your message (max 4000 characters).');
          break;
        case 'AUTH_ERROR':
          Alert.alert('Authentication Error', 'Please log in again.');
          break;
        default:
          Alert.alert('Error', error.message || 'An error occurred');
      }
    });

    return () => {
      offAIChatTokenStatus();
      offAIChatStart();
      offAIChatChunk();
      offAIChatComplete();
      offAIChatCancelled();
      offAIChatError();
      disconnectSocket();
    };
  }, [user]);

  const handleSubmit = () => {
    if (!prompt.trim() || !isConnected || isLoading) return;

    if (costPerMessage && tokens < costPerMessage) {
      Alert.alert('Insufficient Tokens', `You need at least ${costPerMessage} tokens to chat.`);
      return;
    }

    if (prompt.length > 4000) {
      Alert.alert('Prompt Too Long', 'Please keep your message under 4000 characters.');
      return;
    }

    // Add user message to history
    const userMessage: ChatMessage = { role: 'user', content: prompt };
    setChatHistory(prev => [...prev, userMessage]);

    // Send to server via WebSocket
    sendAIChatMessage({
      prompt: prompt,
      sessionId: sessionIdRef.current,
      conversationHistory: chatHistory,
    });

    setPrompt('');

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleCancel = () => {
    if (isLoading) {
      cancelAIChat({ sessionId: sessionIdRef.current });
    }
  };

  const maxChars = aiConfig?.body?.data?.ai?.maxPromptChars || 4000;

  return (
    <Box className="flex-1 bg-background-0 dark:bg-background-950">
      {/* Header */}
      <VStack space="sm" className="p-4 bg-primary-500">
        <Box className="flex-row justify-between items-center">
          <Heading size="xl" className="text-white">
            AI Chat
          </Heading>
          <Badge
            size="lg"
            variant="solid"
            action={tokens > 10 ? 'success' : tokens > 0 ? 'warning' : 'error'}
          >
            <BadgeText>{tokens} Tokens</BadgeText>
          </Badge>
        </Box>
        <Box className="flex-row items-center gap-2">
          <Box
            className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-success-500' : 'bg-error-500'
            }`}
          />
          <Text size="sm" className="text-white">
            {isConnected ? 'Connected' : 'Disconnected'}
          </Text>
        </Box>
      </VStack>

      {/* Chat Messages */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4"
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        <VStack space="md" className="py-4">
          {chatHistory.map((msg, idx) => (
            <Box
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <Box
                className={`max-w-[85%] p-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-primary-500 dark:bg-primary-600'
                    : 'bg-background-100 dark:bg-background-800'
                }`}
              >
                <Text
                  size="md"
                  className={
                    msg.role === 'user'
                      ? 'text-white'
                      : 'text-typography-900 dark:text-typography-50'
                  }
                >
                  {msg.content}
                </Text>
              </Box>
            </Box>
          ))}

          {/* Streaming response */}
          {isLoading && streamingResponse && (
            <Box className="flex justify-start">
              <Box className="max-w-[85%] p-3 rounded-lg bg-background-100 dark:bg-background-800">
                <Text size="md" className="text-typography-900 dark:text-typography-50">
                  {streamingResponse}
                </Text>
                <Spinner size="small" className="mt-2" />
              </Box>
            </Box>
          )}

          {/* Loading indicator when no chunks yet */}
          {isLoading && !streamingResponse && (
            <Box className="flex justify-start">
              <Box className="p-3 rounded-lg bg-background-100 dark:bg-background-800">
                <Spinner size="small" />
              </Box>
            </Box>
          )}
        </VStack>
      </ScrollView>

      {/* Input Area */}
      <VStack space="sm" className="p-4 bg-background-50 dark:bg-background-900">
        <Input
          variant="outline"
          size="lg"
          isDisabled={!isConnected || isLoading}
        >
          <InputField
            placeholder="Type your message..."
            value={prompt}
            onChangeText={setPrompt}
            multiline
            numberOfLines={Platform.OS === 'ios' ? undefined : 3}
            maxLength={maxChars}
            returnKeyType="default"
          />
        </Input>

        <Box className="flex-row justify-between items-center">
          <Text size="xs" className="text-typography-500 dark:text-typography-400">
            {prompt.length}/{maxChars}
          </Text>
          {isLoading ? (
            <Button action="negative" onPress={handleCancel}>
              <ButtonText>Cancel</ButtonText>
            </Button>
          ) : (
            <Button
              action="primary"
              onPress={handleSubmit}
              isDisabled={
                !prompt.trim() ||
                !isConnected ||
                (costPerMessage !== null && tokens < costPerMessage)
              }
            >
              <ButtonText>Send</ButtonText>
            </Button>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default AIChatScreen;
