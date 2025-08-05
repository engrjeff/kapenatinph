import { NavLink } from 'react-router';
import { cn } from '~/lib/utils';
import { buttonVariants } from './ui/button';

const APP_LINKS = [
  {
    path: '/dashboard',
    label: 'Dashboard',
  },
  {
    path: '/inventory',
    label: 'Inventory',
  },
  {
    path: '/products',
    label: 'Products',
  },
  {
    path: '/sales',
    label: 'Sales',
  },
];

export function AppLinks() {
  return (
    <nav className="flex items-center justify-center gap-2">
      {APP_LINKS.map((linkItem) => (
        <NavLink
          key={`app-link-${linkItem.label.toLowerCase()}`}
          to={linkItem.path}
          className={({ isActive }) =>
            cn(
              buttonVariants({
                size: 'sm',
                variant: 'ghost',
              }),
              isActive ? 'text-primary hover:text-primary' : ''
            )
          }
        >
          {linkItem.label}
        </NavLink>
      ))}
    </nav>
  );
}
