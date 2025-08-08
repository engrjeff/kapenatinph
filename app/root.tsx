import { ClerkProvider } from '@clerk/react-router';
import { rootAuthLoader } from '@clerk/react-router/ssr.server';
import { shadcn } from '@clerk/themes';
import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useSearchParams,
} from 'react-router';

import { PackageIcon } from 'lucide-react';
import type { Route } from './+types/root';
import './app.css';
import { LoadingIndicator } from './components/loading-indicator';
import { ThemeProvider } from './components/theme-provider';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'dns-prefetch', href: 'https://api.convex.dev' },
  { rel: 'dns-prefetch', href: 'https://clerk.dev' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export async function loader(args: Route.LoaderArgs) {
  return rootAuthLoader(args);
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <LoadingIndicator />
          {children}
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  const [searchParams] = useSearchParams();

  const redirectTo = searchParams.get('redirectTo') ?? '/dashboard';

  return (
    <ClerkProvider
      loaderData={loaderData}
      signUpFallbackRedirectUrl={'/onboarding'}
      signInFallbackRedirectUrl={redirectTo}
      appearance={{ theme: shadcn }}
    >
      <LoadingIndicator />
      <Outlet />
      <Toaster richColors />
    </ClerkProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details;

    return (
      <div className="space-y-4 container mx-auto max-w-lg h-screen flex items-center justify-center">
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="mb-4 p-3 rounded-full bg-muted/50 dark:bg-muted/20">
            <PackageIcon className="size-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Page not found
          </h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-md leading-relaxed">
            Thepage you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Button size="sm" asChild>
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
