import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useEffect } from 'react';
import { ChatInterface } from '@/features/chat/components/chat-interface';
import AppFrame from '@/features/shared/components/app-frame';
import {
  chatsDestroyMutation,
  chatsListOptions,
  chatsRetrieveOptions,
} from '@/client/@tanstack/react-query.gen';
import { Skeleton } from '@/features/shared/components/ui/skeleton';

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
  pendingComponent: ChatPageSkeleton,
});

function ChatPage() {
  const { chatId } = Route.useParams();
  const { data: chat } = useSuspenseQuery(
    chatsRetrieveOptions({ path: { id: chatId } })
  );
  const { mutate: destroyChat } = useMutation(chatsDestroyMutation());
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (chat.messages.length === 0) {
      destroyChat({ path: { id: chatId } });
      queryClient.invalidateQueries(chatsListOptions());
      navigate({ to: '/assistant' });
    }
  }, [chat.messages.length, chatId, destroyChat, navigate, queryClient]);

  return (
    <AppFrame>
      <ChatInterface chatId={chatId} />
    </AppFrame>
  );
}

function ChatPageSkeleton() {
  return (
    <AppFrame className="h-[calc(100vh-var(--header-height))] py-0">
      <div className="h-full max-w-2xl mx-auto flex flex-col">
        <div className="flex-1 space-y-4 p-4 overflow-hidden">
          <div className="flex gap-3 items-start">
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
          <div className="flex gap-3 items-start justify-end">
            <div className="space-y-2 flex-1 max-w-[80%]">
              <Skeleton className="h-4 w-full ml-auto" />
              <Skeleton className="h-4 w-3/4 ml-auto" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
          </div>
          <div className="flex gap-3 items-start">
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </div>
        <div className="p-4 border-t">
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
      </div>
    </AppFrame>
  );
}
