import { createFileRoute } from '@tanstack/react-router';
import { ChatInterface } from '@/features/chat/components/chat-interface';
import AppFrame from '@/features/shared/components/app-frame';
import { chatsRetrieveOptions } from '@/client/@tanstack/react-query.gen';

export const Route = createFileRoute('/_authed/assistant/$chatId')({
  component: ChatPage,
  loader: async ({ params: { chatId }, context: { queryClient } }) => {
    const chat = await queryClient.ensureQueryData(
      chatsRetrieveOptions({ path: { id: chatId } })
    );
    return {
      crumb: chat.title,
    };
  },
});

function ChatPage() {
  const { chatId } = Route.useParams();
  return (
    <AppFrame className="h-[calc(100vh-var(--header-height))] pb-2">
      <ChatInterface chatId={chatId} />
    </AppFrame>
  );
}
