import { useFetcher } from 'react-router';
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
import { useState } from 'react';

interface ProductDeleteDialogProps {
  trigger: React.ReactNode;
  product: Product;
}

export function ProductDeleteDialog({ 
  trigger, 
  product 
}: ProductDeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const fetcher = useFetcher();
  const isLoading = fetcher.state !== 'idle';

  const handleDelete = () => {
    const formData = new FormData();
    formData.append('intent', 'delete');
    formData.append('id', product.id);
    
    fetcher.submit(formData, { method: 'POST', action: '/products' });
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Product</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{product.name}"? This action cannot be undone and will remove all associated variants and inventory records.
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