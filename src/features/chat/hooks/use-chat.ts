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
  const lastProcessedMessageRef = useRef<string | null>(null);

  if (!wsContext) {
    throw new Error('useChat must be used within a WSProvider');
  }

  const { chatWs } = wsContext;

  // Monitor WebSocket connection status
  useEffect(() => {
    const isOpen = chatWs.readyState === WebSocket.OPEN;
    setIsConnected(isOpen);

    if (isOpen) {
      console.debug('[useChat] WebSocket connected');
    } else {
      console.debug(
        '[useChat] WebSocket disconnected, readyState:',
        chatWs.readyState
      );
    }
  }, [chatWs.readyState]);

  // Handle incoming WebSocket messages
  useEffect(() => {
    if (!chatWs.lastMessage) {
      console.debug('[useChat] No lastMessage available');
      return;
    }

    // Prevent processing the same message twice
    if (lastProcessedMessageRef.current === chatWs.lastMessage.data) {
      return;
    }

    lastProcessedMessageRef.current = chatWs.lastMessage.data;

    console.debug('[useChat] Processing message:', chatWs.lastMessage.data);

    try {
      const data = JSON.parse(chatWs.lastMessage.data) as {
        type: string;
        content?: string;
        message?: string;
      };

      console.debug('[useChat] Parsed message type:', data.type, 'data:', data);

      switch (data.type) {
        case 'start':
          console.debug('[useChat] Starting new response');
          setIsLoading(true);
          currentResponseRef.current = '';
          setError(null);
          break;

        case 'chunk':
          const chunkContent = data.content || '';
          console.debug('[useChat] Received delta chunk:', {
            content: chunkContent,
            length: chunkContent.length,
            accumulatedLength:
              currentResponseRef.current.length + chunkContent.length,
          });
          currentResponseRef.current += chunkContent;
          break;

        case 'end':
          console.debug('[useChat] Ending response, full content:', {
            content: currentResponseRef.current,
            length: currentResponseRef.current.length,
            messageCount: messages.length,
          });
          if (currentResponseRef.current) {
            const newMessage = {
              id: `msg-${messageIdRef.current++}`,
              role: 'assistant' as const,
              content: currentResponseRef.current,
              timestamp: new Date().toISOString(),
            };
            console.debug('[useChat] Adding assistant message:', newMessage);
            setMessages((prev) => [...prev, newMessage]);
          } else {
            console.warn('[useChat] End message received but content is empty');
          }
          setIsLoading(false);
          currentResponseRef.current = '';
          break;

        case 'error':
          const errorMessage = data.message || 'An error occurred';
          console.error('[useChat] Error received from backend:', errorMessage);
          setError(errorMessage);
          setIsLoading(false);
          break;

        default:
          console.warn('[useChat] Unknown message type:', data.type);
      }
    } catch (e) {
      console.error('[useChat] Failed to parse WebSocket message:', e);
      console.error('[useChat] Raw message data:', chatWs.lastMessage.data);
      setError(`Failed to parse message: ${String(e)}`);
    }
  }, [chatWs.lastMessage]);

  const sendMessage = useCallback(
    (content: string): Promise<void> => {
      if (!content.trim()) {
        console.debug('[useChat] Skipping empty message');
        setError('Message cannot be empty');
        return Promise.resolve();
      }

      if (chatWs.readyState !== WebSocket.OPEN) {
        console.error(
          '[useChat] WebSocket not open, state:',
          chatWs.readyState
        );
        setError('Chat is not connected. Please try again.');
        return Promise.resolve();
      }

      // Add user message to messages
      const userMessage = {
        id: `msg-${messageIdRef.current++}`,
        role: 'user' as const,
        content: content.trim(),
        timestamp: new Date().toISOString(),
      };

      console.debug('[useChat] Adding user message:', userMessage);
      setMessages((prev) => [...prev, userMessage]);

      // Send message to backend
      try {
        const payload = { message: content.trim() };
        console.debug('[useChat] Sending payload to backend:', payload);
        chatWs.sendJsonMessage(payload);
      } catch (e) {
        const errorMsg = `Failed to send message: ${String(e)}`;
        console.error('[useChat]', errorMsg);
        setError(errorMsg);
      }

      return Promise.resolve();
    },
    [chatWs]
  );

  const clearMessages = useCallback(() => {
    console.debug('[useChat] Clearing all messages');
    setMessages([]);
    setError(null);
    currentResponseRef.current = '';
    messageIdRef.current = 0;
    lastProcessedMessageRef.current = null;
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
