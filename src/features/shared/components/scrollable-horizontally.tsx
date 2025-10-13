import {
  ScrollArea,
  ScrollBar,
} from '@/features/shared/components/ui/scroll-area';

interface ScrollableHorizontallyProps {
  children: React.ReactNode;
}

export function ScrollableHorizontally({
  children,
}: ScrollableHorizontallyProps) {
  return (
    <ScrollArea className="-mx-(--page-padding) flex">
      <div className="px-(--page-padding) grow">{children}</div>
      <ScrollBar orientation="horizontal" className="bg-background" />
    </ScrollArea>
  );
}
