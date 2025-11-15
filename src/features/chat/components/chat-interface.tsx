import { Chat } from '@/features/shared/components/ui/chat';
import { useChat } from '@/features/chat/hooks/use-chat';

type ChatInterfaceProps = {
  chatId?: string;
};

export function ChatInterface({ chatId }: ChatInterfaceProps) {
  const {
    messages,
    input,
    append,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
  } = useChat({ chatId });
  
  console.log("MESSAGES", messages)

  // TODO: i18n of suggestions
  return (
    <Chat
      className="h-full"
      messages={messages}
      input={input}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      isGenerating={isLoading}
      stop={stop}
      append={append}
      suggestions={[
        'Generate a random bar chart png',
        'What assets do I own?',
        'Give me investment advice.',
        'What is the current market trend?',
      ]}
    />
  );
}
