import type { LucideIcon } from 'lucide-react';
import { cn } from '@/features/shared/utils/styles';

interface Suggestion {
  text: string;
  icon?: LucideIcon;
}

interface PromptSuggestionsProps {
  label: string;
  append: (message: { role: 'user'; content: string }) => void;
  suggestions: Array<Suggestion | string>;
}

export function PromptSuggestions({
  label,
  append,
  suggestions,
}: PromptSuggestionsProps) {
  return (
    <div className="w-full mx-auto space-y-4 flex flex-col justify-center">
      <div className="flex items-center gap-2 px-1">
        <h2 className="text-lg font-semibold">{label}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {suggestions.map((suggestion) => {
          const text =
            typeof suggestion === 'string' ? suggestion : suggestion.text;
          const Icon =
            typeof suggestion === 'object' ? suggestion.icon : undefined;

          return (
            <button
              key={text}
              onClick={() => append({ role: 'user', content: text })}
              className={cn(
                'rounded-lg border bg-card p-4 text-left text-sm shadow-sm',
                'transition-colors hover:bg-accent hover:text-accent-foreground',
                'flex items-center gap-3'
              )}
            >
              {Icon && (
                <Icon className="h-5 w-5 flex-shrink-0 mt-0.5 text-muted-foreground" />
              )}
              <span className="flex-1">{text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
