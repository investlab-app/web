import { CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils"

interface AuthFormHeaderProps {
  title: string;
  description: string;
  className?: string;
}

export function AuthFormHeader({
  title,
  description,
  className,
}: AuthFormHeaderProps) {
  return (
    <div className={cn("text-center", className)}>
      <CardTitle className="text-xl">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </div>
  );
}