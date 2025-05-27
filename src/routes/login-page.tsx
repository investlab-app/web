import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '@clerk/tanstack-react-start';  // Clerk user hook
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from "react";


export default function LoginPage() {

  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate({ to: "/" });  // Redirect to home if already signed in
    }
  }, [isSignedIn, navigate]);

  if (isSignedIn) {
    return null; // or a loading spinner while redirecting
  }


  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          AOo name
        </a>
        <LoginForm />
      </div>
    </div>
  )
  
}
  export const Route = createFileRoute('/login-page')({
    component: LoginPage,
  });