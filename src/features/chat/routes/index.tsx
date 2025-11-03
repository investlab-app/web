import { createFileRoute } from '@tanstack/react-router';
import { ChatInterface } from '../components/chat-interface';

export const Route = createFileRoute('/_authed/chat/')({
  component: ChatPage,
});

function ChatPage() {
  return <ChatInterface />;
}
