import { PackageIcon } from 'lucide-react';
import pluralize from 'pluralize';
import { Link } from 'react-router';
import { Badge } from '~/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import type { Inventory } from '~/generated/prisma/client';
import { cn, formatCurrency } from '~/lib/utils';
import { InventoryRowActions } from './inventory-row-actions';
import { InventoryStatusBadge } from './inventory-status-badge';

export function InventoryTable({
  data,
}: {
  data: Array<Inventory & { category: { name: string } }>;
}) {
  return (
    <>
      {/* Table */}
      <div className="overflow-x-auto border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-accent">
              <TableHead>#</TableHead>
              <TableHead>Item Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Cost Price</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="mb-3 p-2 rounded-full bg-muted/50 dark:bg-muted/20">
                      <PackageIcon className="size-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                      No inventory items found
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Try adjusting your filters or add new items
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, itemIndex) => (
                <TableRow key={item.id} className="hover:bg-muted/50">
                  <TableCell>{itemIndex + 1}</TableCell>
                  <TableCell>
                    <div>
                      <Link
                        to={`/inventory/${item.id}`}
                        className="hover:underline"
                      >
                        <p className="font-medium">{item.name}</p>
                      </Link>
                      <span className="text-xs text-muted-foreground">
                        {item.sku}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.category.name}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span
                        className={cn(
                          'font-medium',
                          item.quantity === 0
                            ? 'text-red-600'
                            : item.reorderLevel &&
                                item.quantity <= item.reorderLevel
                              ? 'text-yellow-600'
                              : 'text-foreground'
                        )}
                      >
                        {item.quantity}
                      </span>{' '}
                      <span className="text-muted-foreground">
                        {pluralize(item.unit, item.quantity)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <InventoryStatusBadge status={item.status} />
                  </TableCell>
                  <TableCell>{formatCurrency(item.costPrice)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.supplier || '-'}
                  </TableCell>
                  <TableCell>
                    <InventoryRowActions inventory={item} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
