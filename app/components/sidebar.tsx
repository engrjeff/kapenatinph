import {
  HomeIcon,
  PackageIcon,
  SettingsIcon,
  ShoppingBagIcon,
  TrendingUpIcon,
} from 'lucide-react';
import { NavLink } from 'react-router';
import { cn } from '~/lib/utils';
import { Button, buttonVariants } from './ui/button';

const NAVIGATION_ITEMS = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: HomeIcon,
  },
  {
    path: '/inventory',
    label: 'Inventory',
    icon: PackageIcon,
  },
  {
    path: '/products',
    label: 'Products',
    icon: ShoppingBagIcon,
  },
  {
    path: '/sales',
    label: 'Sales',
    icon: TrendingUpIcon,
  },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-14 w-64 bg-background border-r border-border flex flex-col h-[calc(100vh-3.5rem)] z-40">
      <div className="p-6">
        <p className="text-xs font-semibold uppercase mb-4 text-muted-foreground">
          Menu
        </p>
        <nav className="space-y-2">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={`sidebar-link-${item.label.toLowerCase()}`}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    buttonVariants({
                      variant: 'ghost',
                      size: 'sm',
                    }),
                    'w-full justify-start gap-2',
                    isActive ? 'bg-accent text-accent-foreground' : ''
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-border">
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2"
          >
            <SettingsIcon className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>
    </aside>
  );
}
