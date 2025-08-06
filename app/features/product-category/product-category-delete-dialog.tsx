import { type ComponentProps } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog';
import type { ProductCategory } from '~/generated/prisma/client';
import { useFetcherWithResponseHandler } from '~/hooks/useFetcherWithResponseHandler';

interface ProductCategoryDeleteDialogProps
  extends ComponentProps<typeof AlertDialog> {
  category: ProductCategory & {
    _count: {
      products: number;
    };
  };
}

export function ProductCategoryDeleteDialog({
  category,
  ...dialogProps
}: ProductCategoryDeleteDialogProps) {
  const fetcher = useFetcherWithResponseHandler({
    redirectTo: '/product-categories',
  });
  const isLoading = fetcher.state !== 'idle';

  const handleDelete = () => {
    fetcher.submit(
      { id: category.id, intent: 'delete' },
      {
        method: 'POST',
        action: '/product-categories',
        encType: 'application/json',
      }
    );

    dialogProps.onOpenChange?.(false);
  };

  const hasProducts = category._count.products > 0;

  return (
    <AlertDialog {...dialogProps}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Category</AlertDialogTitle>
          <AlertDialogDescription>
            {hasProducts ? (
              <>
                Cannot delete "{category.name}" because it contains{' '}
                {category._count.products} product(s). Please move or delete the
                products first before deleting this category.
              </>
            ) : (
              <>
                Are you sure you want to delete "{category.name}"? This action
                cannot be undone.
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
