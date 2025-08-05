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
import type { ProductCategory } from '~/generated/prisma/client';
import { useState } from 'react';

interface ProductCategoryDeleteDialogProps {
  trigger: React.ReactNode;
  category: ProductCategory & {
    _count: {
      products: number;
    };
  };
}

export function ProductCategoryDeleteDialog({ 
  trigger, 
  category 
}: ProductCategoryDeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const fetcher = useFetcher();
  const isLoading = fetcher.state !== 'idle';

  const handleDelete = () => {
    const formData = new FormData();
    formData.append('intent', 'delete');
    formData.append('id', category.id);
    
    fetcher.submit(formData, { method: 'POST', action: '/product-categories' });
    setOpen(false);
  };

  const hasProducts = category._count.products > 0;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Category</AlertDialogTitle>
          <AlertDialogDescription>
            {hasProducts ? (
              <>
                Cannot delete "{category.name}" because it contains {category._count.products} product(s). 
                Please move or delete the products first before deleting this category.
              </>
            ) : (
              <>
                Are you sure you want to delete "{category.name}"? This action cannot be undone.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {!hasProducts && (
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}