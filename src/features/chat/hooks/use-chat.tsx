import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import z from 'zod';
import { useNavigate } from '@tanstack/react-router';
import type { Message } from '@/features/shared/components/ui/chat-message';
import type { ChatDetail } from '@/client/types.gen';
import {
  chatsCreateMutation,
  chatsMessagesCreateMutation,
  chatsRetrieveOptions,
} from '@/client/@tanstack/react-query.gen';
import { useWS } from '@/features/shared/hooks/use-ws';

const chatSchema = z.object({
  type: z.literal('llm'),
  data: z.discriminatedUnion('state', [
    z.object({
      state: z.literal('streaming'),
      chunk: z.string(),
    }),
    z.object({
      state: z.literal('start'),
    }),
    z.object({
      state: z.literal('end'),
    }),
  ]),
});

type LastChatMessageState = 'idle' | 'streaming' | 'done';
interface UseLastChatMessageReturn {
  message: Message | null;
  state: LastChatMessageState;
  reset: () => void;
}

function useLastChatMessage(): UseLastChatMessageReturn {
  const [message, setMessage] = useState<Message | null>(null);
  const [state, setState] = useState<LastChatMessageState>('idle');
  const ws = useWS([]);

  const reset = () => {
    setMessage(null);
    setState('idle');
  };

  useEffect(() => {
    if (!ws.lastJsonMessage || ws.lastJsonMessage.type !== 'llm') {
      return;
    }

    const result = chatSchema.safeParse(ws.lastJsonMessage);
    if (result.error) {
      console.error('Invalid chat message format', result.error);
      return;
    }

    const data = result.data.data;

    switch (data.state) {
      case 'end':
        setState('done');
        break;
      case 'streaming':
        setMessage((currentMessage) => {
          if (currentMessage === null) {
            return {
              id: 'streaming-message' as const,
              role: 'assistant' as const,
              content: data.chunk,
            };
          }

          return {
            id: 'streaming-message' as const,
            role: 'assistant' as const,
            content: currentMessage.content + data.chunk,
          };
        });
        break;
      case 'start':
        setState('streaming');
        break;
    }
  }, [ws.lastJsonMessage]);

  return { message, state, reset };
}

interface UseChatParams {
  chatId?: string;
}

interface UseChatReturn {
  messages: Array<Message>;
  input: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (event?: { preventDefault?: () => void }) => void;
  isLoading: boolean;
  stop: () => void;
  append: (message: { role: 'user'; content: string }) => void;
}

export function useChat({ chatId }: UseChatParams): UseChatReturn {
  const [input, setInput] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: history } = useQuery({
    ...chatsRetrieveOptions({ path: { id: chatId! } }),
    enabled: !!chatId,
  });

  const { mutate: createChatMutation } = useMutation({
    ...chatsCreateMutation(),
    onSuccess: async (data, variables) => {
      queryClient.setQueryData(
        chatsRetrieveOptions({ path: { id: data.id } }).queryKey,
        (old: ChatDetail | undefined) => {
          return {
            id: data.id,
            created_at: data.created_at,
            updated_at: data.updated_at,
            title: data.title,
            messages: [
              ...(old?.messages ?? []),
              {
                id: 'optimistic-user-message-' + Date.now(),
                role: 'user',
                content: variables.body.first_message,
                createdAt: new Date(),
                // TODO: Implement these
                // experimental_attachments: variables.body.experimental_attachments,
                // toolInvocations: [],
                // parts: [],
              } satisfies Message,
            ],
          };
        }
      );

      await navigate({
        to: '/assistant/$chatId',
        params: { chatId: data.id },
      });
    },
  });

  const { mutateAsync: sendMessageMutation } = useMutation({
    ...chatsMessagesCreateMutation(),
    onMutate: async (variables) => {
      // Cancel outgoing refetches to prevent overwriting optimistic update
      await queryClient.cancelQueries({
        queryKey: chatsRetrieveOptions({ path: { id: chatId! } }).queryKey,
      });

      // Get previous data for rollback
      const previousData = queryClient.getQueryData(
        chatsRetrieveOptions({ path: { id: chatId! } }).queryKey
      );

      // Optimistically update cache with new user message
      queryClient.setQueryData(
        chatsRetrieveOptions({ path: { id: chatId! } }).queryKey,
        (old: ChatDetail | undefined) => {
          if (!old || !chatId) return old;
          return {
            ...old,
            messages: [
              ...old.messages,
              {
                id: 'optimistic-user-message-' + Date.now(),
                role: 'user',
                content: variables.body.content,
                createdAt: new Date(),
                // TODO: Implement these
                // experimental_attachments: variables.body.experimental_attachments,
                // toolInvocations: [],
                // parts: [],
              } satisfies Message,
            ],
          };
        }
      );

      return { previousData };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(
          chatsRetrieveOptions({ path: { id: chatId! } }).queryKey,
          context.previousData
        );
      }
    },
  });

  const {
    message: lastChatMessage,
    state: lastChatMessageState,
    reset,
  } = useLastChatMessage();

  if (lastChatMessageState === 'done' && lastChatMessage?.content) {
    queryClient.setQueryData(
      chatsRetrieveOptions({ path: { id: chatId! } }).queryKey,
      (old: ChatDetail | undefined) => {
        if (!old || !chatId) return old;
        return {
          ...old,
          messages: [...old.messages, lastChatMessage],
        };
      }
    );
    reset();
  }

  const sendMessage = async (message: string) => {
    if (!chatId) {
      createChatMutation({
        body: {
          first_message: message,
          title: 'New Chat',
        },
      });
      return;
    }
    await sendMessageMutation({
      body: { content: message, role: 'user' },
      path: { id: chatId },
    });
  };

  // TODO: Implement stop functionality
  const handleStop = () => {
    setInput('');
  };

  const append = (message: { role: 'user'; content: string }) => {
    sendMessage(message.content);
  };

  const internalHistoryMessages = history?.messages.map(
    (msg) =>
      ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        createdAt: msg.createdAt ? new Date(msg.createdAt) : undefined,
        // experimental_attachments: msg.experimental_attachments,
        // toolInvocations: msg.tool_invocations,
        parts: msg.parts
          ?.map((part) => {
            switch (part.type) {
              case 'text':
                return {
                  type: 'text' as const,
                  text: part.text,
                };
              case 'file':
                return {
                  type: 'file' as const,
                  mimeType: part.mimeType,
                  data: part.data,
                };
              case 'tool-invocation':
                return undefined;
              case 'reasoning':
                return {
                  type: 'reasoning' as const,
                  reasoning: part.reasoning,
                };
              default:
                return undefined;
            }
          })
          .filter((x) => x !== undefined),
      }) satisfies Message
  );

  return {
    messages: lastChatMessage
      ? [...(internalHistoryMessages ?? []), lastChatMessage]
      : (internalHistoryMessages ?? []),
    append,
    input,
    handleInputChange: (event) => setInput(event.target.value),
    handleSubmit: (event) => {
      event?.preventDefault?.();
      sendMessage(input);
      setInput('');
    },
    isLoading: lastChatMessageState === 'streaming',
    stop: handleStop,
  };
}
