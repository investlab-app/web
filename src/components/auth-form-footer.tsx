import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

interface AuthFormFooterProps {
  type: "login" | "signup";
  onBack?: () => void;
}

export function AuthFormFooter({ type, onBack }: AuthFormFooterProps) {
  const oppositeType = type === "login" ? "signup" : "login";
  const text = type === "login" 
    ? "Don't have an account?" 
    : "Already have an account?";
  const actionText = type === "login" ? "Sign up" : "Log in";

  return (
    <div className="grid gap-4">
      <Button
        variant="ghost"
        className="w-full"
        onClick={onBack}
        type="button"
      >
        Go Back
      </Button>
      <div className="text-center text-sm">
        {text}{" "}
        <Link 
          to={`/${oppositeType}-page`} 
          className="underline underline-offset-4"
        >
          {actionText}
        </Link>
      </div>
    </div>
  );
}