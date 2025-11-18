import { createFileRoute } from '@tanstack/react-router';
import { ChatInterface } from '@/features/chat/components/chat-interface';
import AppFrame from '@/features/shared/components/app-frame';

export const Route = createFileRoute('/_authed/assistant/')({
  component: ChatPage,
});

function ChatPage() {
  return (
    <AppFrame className="h-[calc(100vh-var(--header-height))] pb-2">
      <ChatInterface />
    </AppFrame>
  );
}
