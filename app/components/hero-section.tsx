import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { ArrowRightIcon, CoffeeIcon } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from './ui/button';

export function HeroSection() {
  return (
    <section className="relative py-20 px-6 overflow-hidden">
      <div className="container mx-auto max-w-6xl text-center relative">
        <div className="flex justify-center mb-6">
          <CoffeeIcon className="h-16 w-16 text-primary" />
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Kape Natin PH
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Simple and powerful coffee shop management system. Track inventory,
          manage products, and grow your business with ease.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <SignedOut>
            <SignInButton mode="modal">
              <Button size="lg" className="gap-2">
                Get Started
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Button size="lg" className="gap-2" asChild>
              <Link to="/dashboard">
                Go to Dashboard
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </Button>
          </SignedIn>

          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}
