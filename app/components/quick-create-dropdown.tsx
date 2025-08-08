import {
  ChefHatIcon,
  ChevronRightIcon,
  PackageIcon,
  PlusCircleIcon,
  ShoppingBagIcon,
} from 'lucide-react';
import { Link } from 'react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Button } from './ui/button';

export function QuickCreateDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <PlusCircleIcon />
          Quick Create
          <ChevronRightIcon className="ml-auto" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width)"
        align="start"
        side="right"
      >
        <DropdownMenuLabel>Create new ...</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/inventory/new">
            <PackageIcon /> Inventory
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/products/new">
            <ShoppingBagIcon /> Product
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/recipes/new">
            <ChefHatIcon /> Recipe
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
