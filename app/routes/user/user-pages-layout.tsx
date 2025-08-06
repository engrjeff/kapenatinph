import { NavLink, Outlet, useLoaderData, useLocation } from 'react-router';
import { AppFooter } from '~/components/app-footer';
import { AppHeader } from '~/components/app-header';
import { Sidebar } from '~/components/sidebar';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import prisma from '~/lib/prisma';
import { protect } from '~/lib/utils.server';
import type { Route } from './+types/user-pages-layout';

export async function loader(args: Route.LoaderArgs) {
  const userId = await protect(args);

  const store = await prisma.store.findFirst({ where: { userId: userId } });

  return { authenticated: true, store };
}

export function useUserPageLayoutLoaderData() {
  return useLoaderData<typeof loader>();
}

function UserPagesLayout({ loaderData }: Route.ComponentProps) {
  const { pathname } = useLocation();

  const isOnboarding = pathname === '/onboarding';

  if (!loaderData?.store && !isOnboarding)
    return (
      <>
        <AppHeader />
        <main className="container mx-auto max-w-5xl min-h-[calc(100vh-3.5rem)] pt-20 p-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>You haven&apos;t set up your shop yet</CardTitle>
              <CardDescription>
                Click the button below to set up your shop.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button type="button" asChild>
                <NavLink to="/onboarding">
                  <span>Set up my Coffee Shop</span>
                </NavLink>
              </Button>
            </CardContent>
          </Card>
        </main>
        <AppFooter />
      </>
    );

  return (
    <>
      <AppHeader />
      {!isOnboarding && <Sidebar />}
      <main
        className={`pt-20 pb-6 px-6 h-screen overflow-y-auto ${!isOnboarding ? 'ml-64' : ''}`}
      >
        <div className="max-w-full mx-auto space-y-6">
          <Outlet />
        </div>
      </main>
      <AppFooter />
    </>
  );
}

export default UserPagesLayout;
