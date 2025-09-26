import * as React from 'react';
import { Tooltip as TooltipPrimitive } from 'radix-ui';

import { forwardRef } from 'react';
import { cn } from '@/features/shared/utils/styles';

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

/** This filter slot prevents the Tooltip from overwriting its children's "data-state" attribute,
 *  ensuring that child components can maintain their own state without interference.
 *  Reference: https://github.com/shadcn-ui/ui/issues/1988 */
const FilterDataStateSlot = forwardRef<
  HTMLButtonElement,
  React.PropsWithChildren<Record<string, unknown>>
>((props, ref) => {
  const { 'data-state': unused, children, ...otherProps } = props;
  void unused;
  return React.cloneElement(
    children as React.ReactElement<Record<string, unknown>>,
    {
      ref,
      ...otherProps,
    }
  );
});

function TooltipTrigger({
  asChild = false,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger> & {
  asChild?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <TooltipPrimitive.Trigger
      asChild={asChild}
      data-slot="tooltip-trigger"
      {...props}
    >
      {asChild ? <FilterDataStateSlot>{children}</FilterDataStateSlot> : null}
    </TooltipPrimitive.Trigger>
  );
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          'bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance',
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
