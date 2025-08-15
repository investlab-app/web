import { SignedIn, SignedOut } from '@clerk/tanstack-react-start';
import { createFileRoute } from '@tanstack/react-router';
import { LandingPage } from '@/routes/_index/-landing-page';
import { Home } from '@/routes/_index/-home-page';

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
