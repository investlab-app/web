import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { BarChart3, PieChart, Search, TrendingUp } from 'lucide-react';
import AppFrame from '@/features/shared/components/app-frame';
import { useChat } from '@/features/chat/hooks/use-chat';
import { Chat } from '@/features/shared/components/ui/chat';

export const Route = createFileRoute('/_authed/assistant/')({
  component: ChatPage,
});

function ChatPage() {
  const { t } = useTranslation();
  const { append, input, handleInputChange, handleSubmit } = useChat({});
  return (
    <AppFrame>
      <Chat
        messages={[]}
        isGenerating={false}
        className="max-w-2xl"
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        stop={stop}
        append={append}
        suggestions={[
          { text: t('chat.suggestionVisualizeAllocations'), icon: PieChart },
          { text: t('chat.suggestionTredningStatistics'), icon: BarChart3 },
          { text: t('chat.suggestionIsAppleUndervalued'), icon: Search },
          { text: t('chat.suggestionTop5Gainers'), icon: TrendingUp },
        ]}
      />
    </AppFrame>
  );
}
