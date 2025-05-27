import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSignIn } from '@clerk/clerk-react';
import { useNavigate } from '@tanstack/react-router';

export function LoginForm({
  
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {

  const { isLoaded, signIn, setActive } = useSignIn();

    const [error, setError] = useState<string | null>(null);

const navigate = useNavigate();
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!isLoaded || !signIn) return;

  const formData = new FormData(e.currentTarget);
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const result = await signIn.create({strategy:"password", identifier: email, password: password});
    console.log("DUPA");
    // const result = await signInRes.attemptFirstFactor({strategy:"password", password:password});
    if (result.status === 'complete') {
      await setActive({ session: result.createdSessionId });
    } 
  } catch (err: any) {
    console.error('Sign-in error:', err.errors);
    setError(err.errors?.[0]?.message || "Something went wrong.");
  }
};

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                
                <Button variant="outline" className="w-full"  onClick={() =>
    signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrlComplete: "http://localhost:3000/sso-callback", // configure in Clerk dashboard
    })
  }>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Google
                </Button>
              </div>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password? 
                    </a>
                  </div>
                  <Input id="password" type="password" name="password" required />
                </div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <Button type="submit" className="w-full">
                  Login
                </Button>
                <Button
              variant="ghost"
              className="w-full "
              onClick={()=>navigate({to: "/"})}
              type="button"
            >
              Go Back
            </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/signup-page" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )

  
  
}
