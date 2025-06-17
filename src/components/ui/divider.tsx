interface DividerProps {
  text: string;
  backgroundClass?: string;
}

export function Divider({ text, backgroundClass }: DividerProps) {
  return (
    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
      <span
        className={`relative z-10 px-2 text-muted-foreground ${backgroundClass ? backgroundClass : 'bg-card'}`}
      >
        {text}
      </span>
    </div>
  );
}
