import { NavLink, Outlet, useLoaderData, useLocation } from 'react-router';
import { AppFooter } from '~/components/app-footer';
import { AppHeader } from '~/components/app-header';
import { AppSidebar } from '~/components/app-sidebar';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { SidebarInset, SidebarProvider } from '~/components/ui/sidebar';
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

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <AppHeader />
        <div className="p-6 space-y-6 flex-1">
          {!isOnboarding && !loaderData.store ? (
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
          ) : (
            <Outlet />
          )}
        </div>
        <AppFooter />
      </SidebarInset>
    </SidebarProvider>
  );
}

export default UserPagesLayout;
