import { EditIcon, MoreHorizontalIcon, TrashIcon } from 'lucide-react';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import type { ProductCategory } from '~/generated/prisma/client';
import { ProductCategoryDeleteDialog } from './product-category-delete-dialog';
import { ProductCategoryDialog } from './product-category-dialog';

interface ProductCategoryTableProps {
  categories: (ProductCategory & {
    _count: {
      products: number;
    };
  })[];
}

export function ProductCategoryTable({
  categories,
}: ProductCategoryTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Products</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {category.description || '—'}
              </TableCell>
              <TableCell>{category._count.products}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <ProductCategoryDialog
                      mode="edit"
                      category={category}
                      trigger={
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <EditIcon className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      }
                    />
                    <ProductCategoryDeleteDialog
                      category={category}
                      trigger={
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <TrashIcon className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      }
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
