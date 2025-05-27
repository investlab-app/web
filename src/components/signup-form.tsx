import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignUp } from "@clerk/clerk-react";
import { useState } from "react";
import { PasswordInput } from "./ui/password-input";
import { useNavigate } from '@tanstack/react-router';

export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [error, setError] = useState<string | null>(null);
  const [showVerification, setShowVerification] = useState(false);
const [code, setCode] = useState("");
const navigate = useNavigate();
const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    console.log(firstName);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);

    try {
      const result = await signUp.create({
        emailAddress: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
      });


    await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

    setLoading(false);
    setError(null); 
    setShowVerification(true);


      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
      }
    } catch (err: any) {
        setLoading(false);
      setError(err.errors?.[0]?.message || "Something went wrong.");
      console.error("Sign-up error:", err);
    }
  };


const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
  
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
      }
    } catch (err: any) {
      setError("Invalid or expired verification code.");
    }
  };
 
  if (showVerification) {
    const handleBack = () => {
        setError(null);       // Clear any error messages
        setShowVerification(false); // Go back to the previous form (e.g., signup form)
      };

    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Verify your email</CardTitle>
            <CardDescription>Enter the code sent to your email</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCodeSubmit} className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  name="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <Button type="submit" className="w-full">
                Verify Email
              </Button>
              <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={handleBack}
              type="button"
            >
              Go Back
            </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default: show sign-up form
  return (
    
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>Sign up with email</CardDescription>
        </CardHeader>
        <CardContent>
        {loading && (
    <div className="flex justify-center mb-4">
      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary" />
    </div>
  )}
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" name="email" required />
              </div>
              <PasswordInput id="password" name="password" required />
<PasswordInput id="confirmPassword" name="confirmPassword" label="Confirm Password" required />
            
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
              <Button
              variant="ghost"
              className="w-full"
              onClick={()=>navigate({to: "/"})}
              type="button"
            >
              Go Back
            </Button>
            <div className="text-center text-sm">
                Already have an account?{" "}
                <a href="/login-page" className="underline underline-offset-4">
                  Log in
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}