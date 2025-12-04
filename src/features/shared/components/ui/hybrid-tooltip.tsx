import React, { createContext, useContext, useEffect, useState } from 'react';
import { Popover as PopoverPrimitive } from 'radix-ui';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';
import type { PropsWithChildren } from 'react';
import { cn } from '@/features/shared/utils/styles';

const TouchContext = createContext<boolean>(false);
const useTouch = () => useContext(TouchContext);

export const HybridTooltipProvider = ({
  children,
  delayDuration,
}: PropsWithChildren & { delayDuration?: number }) => {
  const [isTouch, setTouch] = useState<boolean>(false);

  useEffect(() => {
    // Media query to detect touch devices (pointer: coarse)
    const mq = window.matchMedia('(pointer: coarse)');

    const update = () => setTouch(mq.matches);

    // Initial check
    update();

    // Listen for changes (e.g., plugging in a mouse or DevTools toggle)
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return (
    <TouchContext.Provider value={isTouch}>
      <TooltipProvider delayDuration={delayDuration}>
        {children}
      </TooltipProvider>
    </TouchContext.Provider>
  );
};

export const HybridTooltip = (
  props: React.ComponentProps<typeof Tooltip> &
    React.ComponentProps<typeof Popover>
) => {
  const isTouch = useTouch();
  return isTouch ? <Popover {...props} /> : <Tooltip {...props} />;
};

export const HybridTooltipTrigger = (
  props: React.ComponentProps<typeof TooltipTrigger> &
    React.ComponentProps<typeof PopoverTrigger>
) => {
  const isTouch = useTouch();
  return isTouch ? (
    <PopoverTrigger {...props} />
  ) : (
    <TooltipTrigger {...props} />
  );
};

export const HybridTooltipContent = (
  props: React.ComponentProps<typeof TooltipContent> &
    React.ComponentProps<typeof PopoverContent>
) => {
  const isTouch = useTouch();

  return isTouch ? (
    <PopoverContent
      side="top"
      {...props}
      className={cn(
        'bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 rounded-md px-3 py-1.5 text-xs text-balance border-0 p-0 shadow-md', // from Tooltip
        'px-3 py-1.5 text-center min-w-0 max-w-[calc(100vw-2rem)]'
      )}
    >
      {props.children}
      <PopoverPrimitive.Arrow className="bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
    </PopoverContent>
  ) : (
    <TooltipContent side="top" {...props} />
  );
};
