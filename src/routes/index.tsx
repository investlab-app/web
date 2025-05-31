import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { createFileRoute } from '@tanstack/react-router';
import { LandingPage } from '@/features/landing/landing-page'; // You create this
import { HomePage } from '@/features/home/home-page'; // You already have this

export const Route = createFileRoute('/')({
  component: IndexPage,
});

function IndexPage() {
  return (
    <>
      <SignedOut>
        <LandingPage />
      </SignedOut>
      <SignedIn>
        <HomePage />
      </SignedIn>
    </>
  );
}
