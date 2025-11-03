import { createFileRoute } from '@tanstack/react-router';
import { ChatInterface } from '@/features/chat/components/chat-interface';
import AppFrame from '@/features/shared/components/app-frame';

export const Route = createFileRoute('/_authed/chat')({
  component: ChatPage,
});

function ChatPage() {
  return (
    <AppFrame>
      <ChatInterface className='-m-4'/>
    </AppFrame>
  );
}
