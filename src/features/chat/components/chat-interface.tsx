import { useEffect, useRef } from 'react';
import { Loader2, Send } from 'lucide-react';
import { useChat } from '../hooks/use-chat';
import { Button } from '@/features/shared/components/ui/button';
import { Input } from '@/features/shared/components/ui/input';
import {
  Message,
  MessageAvatar,
  MessageContent,
} from '@/features/shared/components/ai-elements/message';

export function ChatInterface() {
  const {
    messages,
    sendMessage,
    clearMessages,
    isLoading,
    isConnected,
    error,
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    console.debug('[ChatInterface] Messages updated, count:', messages.length);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Debug component mounting and connection status
  useEffect(() => {
    console.debug('[ChatInterface] Component mounted/updated', {
      isConnected,
      messageCount: messages.length,
      isLoading,
      hasError: !!error,
    });
  }, [isConnected, messages.length, isLoading, error]);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = inputRef.current;
    if (!input || !input.value.trim()) {
      console.debug('[ChatInterface] Skipping send - empty input');
      return;
    }

    const message = input.value.trim();
    console.debug('[ChatInterface] Sending message:', message);
    input.value = '';

    await sendMessage(message);
  };

  return (
    <div className="flex flex-col bg-background h-[calc(100vh-var(--header-height))]">
      {/* Header */}
      <div className="border-b px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Financial Assistant</h1>
            <p className="text-xs text-muted-foreground">
              {isConnected ? (
                <span className="text-green-600">✓ Connected</span>
              ) : (
                <span className="text-red-600">✗ Disconnected</span>
              )}
            </p>
          </div>
          {messages.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                console.debug('[ChatInterface] Clearing messages');
                clearMessages();
              }}
              disabled={isLoading}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="max-w-md">
              <h2 className="text-xl font-semibold mb-2">
                Welcome to Financial Assistant
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Ask me about market data, your portfolio, trading strategies, or
                financial insights.
              </p>
              <QuerySuggestions onSuggestionClick={sendMessage} />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <Message key={message.id} from={message.role}>
                {message.role === 'user' ? (
                  <MessageAvatar src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22currentColor%22%3E%3Cpath d=%22M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z%22/%3E%3C/svg%3E" />
                ) : (
                  <MessageAvatar
                    src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22currentColor%22%3E%3Cpath d=%22M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z%22/%3E%3C/svg%3E"
                    name="AI"
                  />
                )}
                <MessageContent>{message.content}</MessageContent>
              </Message>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">
                    Processing...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="border-t border-red-200 bg-red-50 px-4 py-2 sm:px-6">
          <p className="text-sm text-red-800">{error}</p>
          <p className="text-xs text-red-600 mt-1">
            Open the browser console (F12) for more debugging information
          </p>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t px-4 py-4 sm:px-6">
        <form onSubmit={handleSendMessage} className="space-y-2">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Ask me anything about stocks or your portfolio..."
              disabled={!isConnected || isLoading}
              className="flex-1"
              autoFocus
            />
            <Button
              type="submit"
              disabled={!isConnected || isLoading}
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          {!isConnected && (
            <p className="text-xs text-muted-foreground">
              ⚠️ Chat is not connected. Please refresh the page.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

function QuerySuggestions({
  onSuggestionClick,
}: {
  onSuggestionClick: (message: string) => Promise<void>;
}) {
  const suggestions = [
    'What is the current price of AAPL?',
    'Show me my portfolio positions',
    'What was my trading activity last week?',
    'How is the market today?',
  ];

  const handleClick = (suggestion: string) => {
    console.debug('[ChatInterface] Suggestion clicked:', suggestion);
    void onSuggestionClick(suggestion);
  };

  return (
    <div className="grid grid-cols-1 gap-2">
      {suggestions.map((suggestion) => (
        <Button
          key={suggestion}
          variant="outline"
          className="justify-start text-left h-auto py-2 px-3"
          onClick={() => handleClick(suggestion)}
          type="button"
        >
          <span className="text-xs">{suggestion}</span>
        </Button>
      ))}
    </div>
  );
}
