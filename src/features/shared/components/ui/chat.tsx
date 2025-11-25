/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { forwardRef, useCallback, useRef, useState } from 'react';
import { ArrowDown, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ReactElement } from 'react';

import type { Message } from '@/features/shared/components/ui/chat-message';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/features/shared/utils/styles';
import { useAutoScroll } from '@/features/shared/hooks/use-auto-scroll';
import { Button } from '@/features/shared/components/ui/button';
import { CopyButton } from '@/features/shared/components/ui/copy-button';
import { MessageInput } from '@/features/shared/components/ui/message-input';
import { MessageList } from '@/features/shared/components/ui/message-list';
import { PromptSuggestions } from '@/features/shared/components/ui/prompt-suggestions';
import { ChatHistory } from '@/features/shared/components/ui/chat-history';
import { useSidebar } from '@/features/shared/components/ui/sidebar';

interface Suggestion {
  text: string;
  icon?: LucideIcon;
}

interface ChatPropsBase {
  handleSubmit: (
    event?: { preventDefault?: () => void },
    options?: { experimental_attachments?: FileList }
  ) => void;
  messages: Array<Message>;
  input: string;
  className?: string;
  handleInputChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  isGenerating: boolean;
  stop?: () => void;
  onRateResponse?: (
    messageId: string,
    rating: 'thumbs-up' | 'thumbs-down'
  ) => void;
  setMessages?: (messages: Array<any>) => void;
  transcribeAudio?: (blob: Blob) => Promise<string>;
}

interface ChatPropsWithoutSuggestions extends ChatPropsBase {
  append?: never;
  suggestions?: never;
}

interface ChatPropsWithSuggestions extends ChatPropsBase {
  append: (message: { role: 'user'; content: string }) => void;
  suggestions: Array<Suggestion | string>;
}

export type ChatProps = ChatPropsWithoutSuggestions | ChatPropsWithSuggestions;

export function Chat({
  messages,
  handleSubmit,
  input,
  handleInputChange,
  stop,
  isGenerating,
  append,
  suggestions,
  className,
  onRateResponse,
  setMessages,
  transcribeAudio,
}: ChatProps) {
  const { t } = useTranslation();
  const { isMobile, open } = useSidebar();
  const lastMessage = messages.at(-1);
  const isEmpty = messages.length === 0;
  const isTyping = lastMessage?.role === 'user';

  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  // Enhanced stop function that marks pending tool calls as cancelled
  const handleStop = useCallback(() => {
    stop?.();

    if (!setMessages) return;

    const latestMessages = [...messagesRef.current];
    const lastAssistantMessage = latestMessages.findLast(
      (m) => m.role === 'assistant'
    );

    if (!lastAssistantMessage) return;

    let needsUpdate = false;
    let updatedMessage = { ...lastAssistantMessage };

    if (lastAssistantMessage.toolInvocations) {
      const updatedToolInvocations = lastAssistantMessage.toolInvocations.map(
        (toolInvocation) => {
          if (toolInvocation.state === 'call') {
            needsUpdate = true;
            return {
              ...toolInvocation,
              state: 'result',
              result: {
                content: 'Tool execution was cancelled',
                __cancelled: true, // Special marker to indicate cancellation
              },
            } as const;
          }
          return toolInvocation;
        }
      );

      if (needsUpdate) {
        updatedMessage = {
          ...updatedMessage,
          toolInvocations: updatedToolInvocations,
        };
      }
    }

    if (lastAssistantMessage.parts && lastAssistantMessage.parts.length > 0) {
      const updatedParts = lastAssistantMessage.parts.map((part: any) => {
        if (
          part.type === 'tool-invocation' &&
          part.toolInvocation &&
          part.toolInvocation.state === 'call'
        ) {
          needsUpdate = true;
          return {
            ...part,
            toolInvocation: {
              ...part.toolInvocation,
              state: 'result',
              result: {
                content: 'Tool execution was cancelled',
                __cancelled: true,
              },
            },
          };
        }
        return part;
      });

      if (needsUpdate) {
        updatedMessage = {
          ...updatedMessage,
          parts: updatedParts,
        };
      }
    }

    if (needsUpdate) {
      const messageIndex = latestMessages.findIndex(
        (m) => m.id === lastAssistantMessage.id
      );
      if (messageIndex !== -1) {
        latestMessages[messageIndex] = updatedMessage;
        setMessages(latestMessages);
      }
    }
  }, [stop, setMessages, messagesRef]);

  const messageOptions = useCallback(
    (message: Message) => ({
      actions: onRateResponse ? (
        <>
          <div className="border-r pr-1">
            <CopyButton
              content={message.content}
              copyMessage="Copied response to clipboard!"
            />
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={() => onRateResponse(message.id, 'thumbs-up')}
          >
            <ThumbsUp className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={() => onRateResponse(message.id, 'thumbs-down')}
          >
            <ThumbsDown className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <CopyButton
          content={message.content}
          copyMessage="Copied response to clipboard!"
        />
      ),
    }),
    [onRateResponse]
  );

  return (
    <ChatContainer className={cn('mx-auto', className)}>
      {isEmpty && append && suggestions ? (
        <div className="flex flex-col gap-8 py-8">
          <PromptSuggestions
            label={t('chat.suggestions_label')}
            append={append}
            suggestions={suggestions}
          />
          <ChatHistory label={t('chat.history_label')} />
        </div>
      ) : null}

      {messages.length > 0 ? (
        <ChatMessages messages={messages}>
          <MessageList
            messages={messages}
            isTyping={isTyping}
            messageOptions={messageOptions}
          />
        </ChatMessages>
      ) : null}

      <div
        className="fixed bottom-0 left-0 right-0"
        style={{
          marginLeft: isMobile
            ? '0'
            : open
              ? 'var(--sidebar-width)'
              : 'var(--sidebar-width-icon)',
          transitionTimingFunction: 'var(--ease-out)',
          transitionDuration: '200ms',
          transitionProperty: 'margin',
        }}
      >
        <ChatForm
          className="max-w-3xl px-4 mx-auto"
          handleSubmit={handleSubmit}
        >
          {({ files, setFiles }) => (
            <MessageInput
              value={input}
              onChange={handleInputChange}
              placeholder={t('chat.input_placeholder')}
              files={files}
              setFiles={setFiles}
              stop={handleStop}
              isGenerating={isGenerating}
              transcribeAudio={transcribeAudio}
            />
          )}
        </ChatForm>
      </div>
    </ChatContainer>
  );
}
Chat.displayName = 'Chat';

export function ChatMessages({
  messages,
  className,
  children,
}: React.PropsWithChildren<{
  messages: Array<Message>;
  className?: string;
}>) {
  const {
    containerRef,
    scrollToBottom,
    handleScroll,
    shouldAutoScroll,
    handleTouchStart,
  } = useAutoScroll([messages]);

  return (
    <div
      className={cn('grid grid-cols-1 pb-24', className)}
      ref={containerRef}
      onScroll={handleScroll}
      onTouchStart={handleTouchStart}
    >
      <div className="max-w-full [grid-column:1/1] [grid-row:1/1]">
        {children}
      </div>

      {!shouldAutoScroll && (
        <div className="pointer-events-none flex flex-1 items-end justify-end [grid-column:1/1] [grid-row:1/1]">
          <div className="sticky bottom-0 left-0 flex w-full justify-end">
            <Button
              onClick={scrollToBottom}
              className="pointer-events-auto h-8 w-8 rounded-full ease-in-out animate-in fade-in-0 slide-in-from-bottom-1"
              size="icon"
              variant="ghost"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export const ChatContainer = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('grid max-h-full w-full grid-rows-[1fr_auto]', className)}
      {...props}
    />
  );
});
ChatContainer.displayName = 'ChatContainer';

interface ChatFormProps {
  className?: string;
  handleSubmit: (
    event?: { preventDefault?: () => void },
    options?: { experimental_attachments?: FileList }
  ) => void;
  children: (props: {
    files: Array<File> | null;
    setFiles: React.Dispatch<React.SetStateAction<Array<File> | null>>;
  }) => ReactElement;
}

export const ChatForm = forwardRef<HTMLFormElement, ChatFormProps>(
  ({ children, handleSubmit, className }, ref) => {
    const [files, setFiles] = useState<Array<File> | null>(null);

    const onSubmit = (event: React.FormEvent) => {
      if (!files) {
        handleSubmit(event);
        return;
      }

      const fileList = createFileList(files);
      handleSubmit(event, { experimental_attachments: fileList });
      setFiles(null);
    };

    return (
      <form ref={ref} onSubmit={onSubmit} className={className}>
        {children({ files, setFiles })}
      </form>
    );
  }
);
ChatForm.displayName = 'ChatForm';

function createFileList(files: Array<File> | FileList): FileList {
  const dataTransfer = new DataTransfer();
  for (const file of Array.from(files)) {
    dataTransfer.items.add(file);
  }
  return dataTransfer.files;
}
