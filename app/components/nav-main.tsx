import { type Icon } from '@tabler/icons-react';
import { NavLink } from 'react-router';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  sidebarMenuButtonVariants,
  SidebarMenuItem,
} from '~/components/ui/sidebar';
import { cn } from '~/lib/utils';
import { QuickCreateDropdown } from './quick-create-dropdown';

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="mb-4">
        <QuickCreateDropdown />
      </SidebarGroupContent>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <NavLink
                to={item.url}
                className={({ isActive, isPending }) =>
                  cn(
                    sidebarMenuButtonVariants(),
                    isActive
                      ? 'bg-primary hover:bg-primary hover:text-primary-foreground'
                      : '',
                    isPending ? 'opacity-90' : ''
                  )
                }
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </NavLink>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
