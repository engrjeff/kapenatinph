import { PackageIcon } from 'lucide-react';
import { Badge } from '~/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { formatCurrency } from '~/lib/utils';
import { ProductRowActions } from './product-row-actions';

export function ProductTable({
  products,
}: {
  products: Array<{
    id: string;
    name: string;
    description: string | null;
    sku: string | null;
    basePrice: number;
    isActive: boolean;
    hasVariants: boolean;
    category: { name: string };
    variantOptions: Array<{
      id: string;
      name: string;
      values: Array<{ value: string }>;
    }>;
    variants: Array<any>;
  }>;
}) {
  return (
    <div className="overflow-x-auto border rounded-md bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-accent">
            <TableHead>#</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Base Price</TableHead>
            <TableHead>Variants</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="mb-3 p-2 rounded-full bg-muted/50 dark:bg-muted/20">
                    <PackageIcon className="size-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    No products found
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Try adding your first product
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            products.map((product, productIndex) => (
              <TableRow key={product.id} className="hover:bg-muted/50">
                <TableCell>{productIndex + 1}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{product.name}</div>
                    {product.description && (
                      <div className="text-sm text-muted-foreground">
                        {product.description}
                      </div>
                    )}
                    {product.sku && (
                      <div className="text-xs text-muted-foreground">
                        SKU: {product.sku}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{product.category.name}</Badge>
                </TableCell>
                <TableCell>
                  <span className="font-medium">
                    {formatCurrency(product.basePrice)}
                  </span>
                </TableCell>
                <TableCell>
                  {product.hasVariants ? (
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">
                        {product.variants.length} total variant
                        {product.variants.length !== 1 ? 's' : ''}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {product.variantOptions
                          .map((vop) => vop.name)
                          .join(', ')}
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No variants
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      product.isActive
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}
                  >
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell>
                  <ProductRowActions productId={product.id} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
