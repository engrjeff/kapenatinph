import {
  CopyIcon,
  EditIcon,
  MoreHorizontalIcon,
  TrashIcon,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import type { Inventory } from '~/generated/prisma/client';
import { InventoryDeleteDialog } from './inventory-delete-dialog';

export function InventoryRowActions({ inventory }: { inventory: Inventory }) {
  const [action, setAction] = useState<'delete'>();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <MoreHorizontalIcon />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36">
          <DropdownMenuItem asChild>
            <Link to={`/inventory/${inventory.id}`}>
              <EditIcon /> Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={`/inventory/new?duplicateId=${inventory.id}`}>
              <CopyIcon /> Make a copy
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setAction('delete')}
          >
            <TrashIcon /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <InventoryDeleteDialog
        inventory={inventory}
        open={action === 'delete'}
        onOpenChange={(open) => {
          if (!open) {
            setAction(undefined);
          }
        }}
      />
    </>
  );
}
