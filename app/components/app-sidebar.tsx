import {
  IconCategory,
  IconChefHat,
  IconCoffee,
  IconHelp,
  IconHome,
  IconPackage,
  IconSettings,
  IconShoppingBag,
  IconTrendingUp,
} from '@tabler/icons-react';
import * as React from 'react';
import { Link } from 'react-router';

import { NavMain } from '~/components/nav-main';
import { NavSecondary } from '~/components/nav-secondary';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '~/components/ui/sidebar';

const data = {
  navMain: [
    {
      url: '/dashboard',
      title: 'Dashboard',
      icon: IconHome,
    },
    {
      url: '/inventory',
      title: 'Inventory',
      icon: IconPackage,
    },
    {
      url: '/products',
      title: 'Products',
      icon: IconShoppingBag,
    },
    {
      url: '/product-categories',
      title: 'Categories',
      icon: IconCategory,
    },
    {
      url: '/recipes',
      title: 'Recipes',
      icon: IconChefHat,
    },
    {
      url: '/sales',
      title: 'Sales',
      icon: IconTrendingUp,
    },
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '#',
      icon: IconSettings,
    },
    {
      title: 'Get Help',
      url: '#',
      icon: IconHelp,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link to="/" className="flex items-center gap-2">
              <IconCoffee className="!size-5" />
              <span className="text-base font-semibold">KapeNatin PH.</span>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
    </Sidebar>
  );
}
