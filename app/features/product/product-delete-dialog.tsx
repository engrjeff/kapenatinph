import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog';
import type { Product } from '~/generated/prisma/client';
import { useFetcherWithResponseHandler } from '~/hooks/useFetcherWithResponseHandler';

interface ProductDeleteDialogProps {
  trigger: React.ReactNode;
  product: Product;
}

export function ProductDeleteDialog({
  trigger,
  product,
}: ProductDeleteDialogProps) {
  const [open, setOpen] = useState(false);

  const fetcher = useFetcherWithResponseHandler({
    redirectTo: '/products',
  });

  const isLoading = fetcher.state !== 'idle';

  const handleDelete = () => {
    fetcher.submit(
      { id: product.id, intent: 'delete' },
      { method: 'POST', action: '/products', encType: 'application/json' }
    );
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Product</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{product.name}"? This action cannot
            be undone and will remove all associated variants and inventory
            records.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
