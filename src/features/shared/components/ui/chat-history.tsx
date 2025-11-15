import { Link } from '@tanstack/react-router';
import { MessageSquare } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import { ScrollArea } from './scroll-area';
import { Skeleton } from './skeleton';
import { chatsListOptions } from '@/client/@tanstack/react-query.gen';
import { cn } from '@/features/shared/utils/styles';

interface ChatHistoryProps {
  label: string;
  className?: string;
}

export function ChatHistory({ label, className }: ChatHistoryProps) {
  const { data: chats, isPending } = useQuery(chatsListOptions());

  if (isPending) {
    return <ChatHistorySkeleton label={label} className={className} />;
  }

  if (!chats || chats.length === 0) {
    return null;
  }

  // Show all chats in reverse chronological order (most recent first)
  const recentChats = chats;
  const showGradient = chats.length > 7;

  return (
    <div className={cn('w-full mx-auto space-y-2 flex flex-col', className)}>
      <div className="flex items-center gap-2 px-1">
        <h2 className="text-sm font-medium text-muted-foreground">{label}</h2>
      </div>

      <div className="relative">
        <ScrollArea className="h-[250px]">
          <div className="flex flex-col gap-1 pr-3">
            {recentChats.map((chat) => (
              <Link
                key={chat.id}
                to="/assistant/$chatId"
                params={{ chatId: chat.id }}
                className={cn(
                  'rounded-md px-2 py-2 text-left',
                  'transition-colors hover:bg-accent',
                  'flex items-center justify-between gap-2'
                )}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <MessageSquare className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                  <span className="text-sm truncate">{chat.title}</span>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(chat.updated_at).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </Link>
            ))}
          </div>
        </ScrollArea>
        {/* Gradient fade at the bottom - only show if there are many chats */}
        {showGradient && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        )}
      </div>
    </div>
  );
}

function ChatHistorySkeleton({ label, className }: ChatHistoryProps) {
  return (
    <div className={cn('w-full mx-auto space-y-2 flex flex-col', className)}>
      <div className="flex items-center gap-2 px-1">
        <h2 className="text-sm font-medium text-muted-foreground">{label}</h2>
      </div>

      <div className="relative">
        <ScrollArea className="h-[250px]">
          <div className="flex flex-col gap-1 pr-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="rounded-md px-2 py-2 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Skeleton className="h-3.5 w-3.5 flex-shrink-0 delay-100" />
                  <Skeleton className="h-4 w-[180px] delay-200" />
                </div>
                <Skeleton className="h-3 w-8 delay-300" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
