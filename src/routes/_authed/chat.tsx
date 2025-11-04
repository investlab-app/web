import { createFileRoute } from '@tanstack/react-router';
import { ChatInterface } from '@/features/chat/components/chat-interface';
import AppFrame from '@/features/shared/components/app-frame';

export const Route = createFileRoute('/_authed/chat')({
  component: ChatPage,
  loader: ({ context: { i18n } }) => {
    return {
      crumb: i18n.t('common.chat'),
    };
  },
});

function ChatPage() {
  return (
    <AppFrame className="p-0">
      <ChatInterface />
    </AppFrame>
  );
}
