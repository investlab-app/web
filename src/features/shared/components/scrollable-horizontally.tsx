interface ScrollableHorizontallyProps {
  children: React.ReactNode;
}

export function ScrollableHorizontally({
  children,
}: ScrollableHorizontallyProps) {
  return (
    <div className="-mx-(--page-padding) flex overflow-x-auto">
      <div className="px-(--page-padding) grow">{children}</div>
    </div>
  );
}
