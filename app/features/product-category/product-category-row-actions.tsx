import { EditIcon, MoreHorizontalIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import type { ProductCategory } from '~/generated/prisma/client';
import { ProductCategoryDeleteDialog } from './product-category-delete-dialog';
import { ProductCategoryDialog } from './product-category-dialog';

export function ProductCategoryRowActions({
  category,
}: {
  category: ProductCategory & {
    _count: {
      products: number;
    };
  };
}) {
  const [action, setAction] = useState<'edit' | 'delete'>();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setAction('edit')}>
            <EditIcon className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setAction('delete')}>
            <TrashIcon className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProductCategoryDialog
        mode="edit"
        category={category}
        key={category.id + action}
        open={action === 'edit'}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setAction(undefined);
          }
        }}
      />

      <ProductCategoryDeleteDialog
        category={category}
        open={action === 'delete'}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setAction(undefined);
          }
        }}
      />
    </>
  );
}
