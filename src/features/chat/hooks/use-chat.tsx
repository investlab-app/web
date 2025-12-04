import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useStore } from '@tanstack/react-store';
import {
  createPendingMessage,
  liveChatsStore,
} from '../stores/live-chats-store';
import type { Message } from '@/features/shared/components/ui/chat-message';
import type { ChatDetail } from '@/client/types.gen';
import {
  chatsCreateMutation,
  chatsListOptions,
  chatsMessagesCreateMutation,
  chatsRetrieveOptions,
} from '@/client/@tanstack/react-query.gen';
import { useBreadcrumbCustomizer } from '@/features/shared/components/breadcrumb-nav';

interface UseChatParams {
  chatId?: string;
}

interface UseChatReturn {
  messages: Array<Message>;
  input: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (event?: { preventDefault?: () => void }) => void;
  isLoading: boolean;
  stop?: () => void;
  append: (message: { role: 'user'; content: string }) => void;
}

export function useChat({ chatId }: UseChatParams): UseChatReturn {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [input, setInput] = useState('');

  const livePart = useStore(liveChatsStore, (state) =>
    chatId === undefined ? null : (state.chats.get(chatId) ?? null)
  );

  const { data: chat, isLoading: isHistoryLoading } = useQuery({
    ...chatsRetrieveOptions({ path: { id: chatId! } }),
    enabled:
      chatId !== undefined &&
      livePart?.state !== 'firstMessage' &&
      livePart?.state !== 'sent',
  });

  useBreadcrumbCustomizer(
    (items) =>
      items.map((item) => {
        if (chatId && item.href.includes(chatId)) {
          const isLoading =
            isHistoryLoading ||
            livePart?.state === 'firstMessage' ||
            livePart?.state === 'sent';
          const title = chat?.title || '';

          return {
            ...item,
            label: title,
            loading: isLoading,
          };
        }
        return item;
      }),
    [chatId, isHistoryLoading, livePart?.state, chat?.title]
  );

  const { mutateAsync: createChatMutation } = useMutation({
    ...chatsCreateMutation(),
    onSuccess: () => {
      queryClient.invalidateQueries(chatsListOptions());
    },
  });

  const { mutateAsync: sendMessageMutation } = useMutation(
    chatsMessagesCreateMutation()
  );

  if (chatId && livePart) {
    const { request, response, state } = livePart;
    if (response && state === 'done') {
      queryClient.setQueryData(
        chatsRetrieveOptions({ path: { id: chatId } }).queryKey,
        (old: ChatDetail | undefined) => {
          if (!old) return old;
          return {
            ...old,
            messages: [...old.messages, request, response],
          };
        }
      );
      liveChatsStore.setState((previous) => {
        const newChats = new Map(previous.chats);
        newChats.delete(chatId);
        return { chats: newChats };
      });
    }
  }

  const messages = [
    ...(chat?.messages ?? []),
    ...(livePart?.request ? [livePart.request] : []),
    ...(livePart?.response ? [livePart.response] : []),
  ].map((msg) => ({
    ...msg,
    createdAt: msg.createdAt ? new Date(msg.createdAt) : undefined,
  }));

  const append = (message: { role: 'user'; content: string }) => {
    const newChatId = crypto.randomUUID();
    createPendingMessage({
      chatId: newChatId,
      content: message.content,
      isFirstMessage: true,
    });
    navigate({
      to: '/assistant/$chatId',
      params: { chatId: newChatId },
    });
    createChatMutation({
      body: { first_message: message.content, id: newChatId },
    });
    setInput('');
  };

  const handleSubmit = (event?: {
    preventDefault?: (() => void) | undefined;
  }) => {
    event?.preventDefault?.();
    if (!chatId) {
      const newChatId = crypto.randomUUID();
      createPendingMessage({
        chatId: newChatId,
        content: input,
        isFirstMessage: true,
      });
      navigate({
        to: '/assistant/$chatId',
        params: { chatId: newChatId },
      });
      createChatMutation({
        body: {
          first_message: input,
          id: newChatId,
        },
      });
    } else {
      createPendingMessage({
        chatId: chatId,
        content: input,
        isFirstMessage: false,
      });
      sendMessageMutation({
        body: { content: input, role: 'user' },
        path: { id: chatId },
      });
    }
    setInput('');
  };

  return {
    messages,
    append,
    input,
    handleInputChange: (event) => setInput(event.target.value),
    handleSubmit,
    isLoading: livePart?.state === 'streaming',
  };
}
