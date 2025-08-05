import { SignedIn, UserButton, useUser } from '@clerk/clerk-react';
import { Link } from 'react-router';
import { ThemeToggler } from './theme-toggler';

export function AppHeader() {
  const { user, isLoaded } = useUser();

  return (
    <header className="border-b">
      <div className="p-4 h-14 flex items-center justify-between container mx-auto">
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
