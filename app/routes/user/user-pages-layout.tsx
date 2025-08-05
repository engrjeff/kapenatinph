import { NavLink, Outlet, useLoaderData, useLocation } from 'react-router';
import { AppFooter } from '~/components/app-footer';
import { AppHeader } from '~/components/app-header';
import { AppLinks } from '~/components/app-links';
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
        <main className="container mx-auto max-w-5xl min-h-[90vh] p-4 space-y-4">
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
      <main className="container mx-auto max-w-5xl min-h-[90vh] p-4 space-y-4">
        {isOnboarding ? null : <AppLinks />}
        <Outlet />
      </main>
      <AppFooter />
    </>
  );
}

export default UserPagesLayout;
