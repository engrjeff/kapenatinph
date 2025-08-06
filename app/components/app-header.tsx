import { SignedIn, UserButton, useUser } from '@clerk/clerk-react';
import { Link } from 'react-router';
import { ThemeToggler } from './theme-toggler';

export function AppHeader() {
  const { user, isLoaded } = useUser();

  return (
    <header className="fixed top-0 left-0 right-0 bg-background border-b z-50">
      <div className="px-6 h-14 flex items-center justify-between">
        <Link to="/" className="font-semibold">
          Kape Natin PH
        </Link>
        <div className="flex items-center gap-4 ml-auto">
          {isLoaded && user ? (
            <SignedIn>
              <p className="text-sm">Welcome, {user?.fullName} </p>
              <UserButton />
            </SignedIn>
          ) : null}
          <ThemeToggler />
        </div>
      </div>
    </header>
  );
}
