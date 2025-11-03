import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { WSContext } from '@/features/shared/providers/ws-provider';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface UseChatReturn {
  messages: Array<ChatMessage>;
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
  isLoading: boolean;
  isConnected: boolean;
  error: string | null;
}

export function useChat(): UseChatReturn {
  const wsContext = useContext(WSContext);
  const [messages, setMessages] = useState<Array<ChatMessage>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messageIdRef = useRef(0);
  const currentResponseRef = useRef('');

  if (!wsContext) {
    throw new Error('useChat must be used within a WSProvider');
  }

  const { chatWs } = wsContext;

  // Monitor WebSocket connection status
  useEffect(() => {
    setIsConnected(chatWs.readyState === WebSocket.OPEN);
  }, [chatWs.readyState]);

  // Handle incoming WebSocket messages
  useEffect(() => {
    if (!chatWs.lastMessage) return;

    try {
      const data = JSON.parse(chatWs.lastMessage.data) as {
        type: string;
        content?: string;
        message?: string;
      };

      switch (data.type) {
        case 'start':
          setIsLoading(true);
          currentResponseRef.current = '';
          setError(null);
          break;

        case 'chunk':
          currentResponseRef.current += data.content || '';
          break;

        case 'end':
          if (currentResponseRef.current) {
            setMessages((prev) => [
              ...prev,
              {
                id: `msg-${messageIdRef.current++}`,
                role: 'assistant',
                content: currentResponseRef.current,
                timestamp: new Date().toISOString(),
              },
            ]);
          }
          setIsLoading(false);
          currentResponseRef.current = '';
          break;

        case 'error':
          setError(data.message || 'An error occurred');
          setIsLoading(false);
          break;

        default:
          console.warn('Unknown message type:', data.type);
      }
    } catch (e) {
      console.error('Failed to parse WebSocket message:', e);
    }
  }, [chatWs.lastMessage]);

  const sendMessage = useCallback(
    (content: string): Promise<void> => {
      if (!content.trim()) {
        setError('Message cannot be empty');
        return Promise.resolve();
      }

      if (chatWs.readyState !== WebSocket.OPEN) {
        setError('Chat is not connected. Please try again.');
        return Promise.resolve();
      }

      // Add user message to messages
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${messageIdRef.current++}`,
          role: 'user',
          content: content.trim(),
          timestamp: new Date().toISOString(),
        },
      ]);

      // Send message to backend
      try {
        chatWs.sendJsonMessage({
          message: content.trim(),
        });
      } catch (e) {
        setError(`Failed to send message: ${String(e)}`);
      }

      return Promise.resolve();
    },
    [chatWs]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    currentResponseRef.current = '';
    messageIdRef.current = 0;
  }, []);

  return {
    messages,
    sendMessage,
    clearMessages,
    isLoading,
    isConnected,
    error,
  };
}
