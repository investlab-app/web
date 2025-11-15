import { BarChart3, PieChart, Search, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  return (
    <Chat
      className="max-w-2xl"
      messages={messages}
      input={input}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      isGenerating={isLoading}
      stop={stop}
      append={append}
      suggestions={[
        { text: t('chat.suggestionVisualizeAllocations'), icon: PieChart },
        { text: t('chat.suggestionTredningStatistics'), icon: BarChart3 },
        { text: t('chat.suggestionIsAppleUndervalued'), icon: Search },
        { text: t('chat.suggestionTop5Gainers'), icon: TrendingUp },
      ]}
    />
  );
}
