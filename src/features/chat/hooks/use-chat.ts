import { useContext, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { WSContext } from '@/features/shared/providers/ws-provider';
import {
  chatHistoryDestroyMutation,
  chatHistoryRetrieveOptions,
} from '@/client/@tanstack/react-query.gen';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

interface UseChatReturn {
  messages: Array<ChatMessage>;
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
  clearHistory: () => Promise<void>;
  isLoading: boolean;
  isConnected: boolean;
  error: string | null;
  isLoadingHistory: boolean;
}

export function useChat(): UseChatReturn {
  const wsContext = useContext(WSContext);
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<Array<ChatMessage>>([]);
  const [error, setError] = useState<string | null>(null);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null
  );

  if (!wsContext) {
    throw new Error('useChat must be used within a WSProvider');
  }

  const { chatWs } = wsContext;

  const {
    data: historyData,
    isLoading: isLoadingHistory,
    error: historyError,
  } = useQuery({
    ...chatHistoryRetrieveOptions(),
    meta: { persist: false },
    staleTime: 1000 * 60 * 5,
  });

  const clearHistoryMutation = useMutation({
    ...chatHistoryDestroyMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatHistoryRetrieve'] });
      setMessages([]);
      setError(null);
    },
    onError: (err) => {
      setError(`Failed to clear history: ${String(err)}`);
    },
  });

  useEffect(() => {
    if (historyData?.messages) {
      const transformedMessages: Array<ChatMessage> = historyData.messages.map(
        (msg: any) => ({
          id: msg.id || crypto.randomUUID(),
          role: msg.role,
          content: msg.content ?? '',
          timestamp: msg.created_at ?? new Date().toISOString(),
        })
      );
      setMessages(transformedMessages);
    }
  }, [historyData]);

  const isConnected = chatWs.readyState === WebSocket.OPEN;

  useEffect(() => {
    if (!chatWs.lastMessage) return;

    try {
      const data = JSON.parse(chatWs.lastMessage.data);

      switch (data.type) {
        case 'start': {
          const streamingMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: '',
            timestamp: new Date().toISOString(),
            isStreaming: true,
          };
          setStreamingMessageId(streamingMessage.id);
          setMessages((prev) => [...prev, streamingMessage]);
          break;
        }

        case 'chunk': {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.isStreaming
                ? { ...msg, content: msg.content + (data.content || '') }
                : msg
            )
          );
          break;
        }

        case 'end': {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.isStreaming
                ? { ...msg, isStreaming: false }
                : msg
            )
          );
          setStreamingMessageId(null);
          break;
        }

        case 'error': {
          setError(data.message || 'An error occurred');
          setStreamingMessageId(null);
          break;
        }
      }
    } catch (e) {
      setError(`Failed to parse message: ${String(e)}`);
    }
  }, [chatWs.lastMessage]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) {
      setError('Message cannot be empty');
      return;
    }

    if (!isConnected) {
      setError('Chat is not connected. Please try again.');
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setError(null);

    try {
      chatWs.sendJsonMessage({ message: content.trim() });
    } catch (e) {
      setError(`Failed to send message: ${String(e)}`);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setError(null);
    setStreamingMessageId(null);
  };

  const clearHistory = async () => {
    await clearHistoryMutation.mutateAsync({});
  };

  return {
    messages,
    sendMessage,
    clearMessages,
    clearHistory,
    isLoading: !!streamingMessageId,
    isConnected,
    error: error || (historyError ? String(historyError) : null),
    isLoadingHistory,
  };
}
