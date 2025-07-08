import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { createFileRoute } from '@tanstack/react-router';
import { LandingPage } from '@/routes/_index/-landing-page'; // You create this
import { Home } from '@/routes/_index/-home-page'; // You create this

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <>
      <SignedOut>
        <LandingPage />
      </SignedOut>
      <SignedIn>
        <Home />
      </SignedIn>
    </>
  );
}
