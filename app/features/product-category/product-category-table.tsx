import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import type { ProductCategory } from '~/generated/prisma/client';
import { ProductCategoryRowActions } from './product-category-row-actions';

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
    <div className="overflow-x-auto border rounded-md bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-accent">
            <TableHead>#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Products</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category, categoryIndex) => (
            <TableRow key={category.id}>
              <TableCell>{categoryIndex + 1}</TableCell>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {category.description || '—'}
              </TableCell>
              <TableCell>{category._count.products}</TableCell>
              <TableCell>
                <ProductCategoryRowActions
                  key={category.id}
                  category={category}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
