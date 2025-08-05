import type { ComponentProps } from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog';
import { SubmitButton } from '~/components/ui/submit-button';
import type { Inventory } from '~/generated/prisma/client';
import { useFetcherWithResponseHandler } from '~/hooks/useFetcherWithResponseHandler';

export function InventoryDeleteDialog({
  inventory,
  ...dialogProps
}: ComponentProps<typeof AlertDialog> & { inventory: Inventory }) {
  const fetcher = useFetcherWithResponseHandler();

  async function handleSubmit() {
    fetcher.submit(
      { id: inventory.id, intent: 'delete' },
      { method: 'POST', action: '/inventory', encType: 'application/json' }
    );

    dialogProps.onOpenChange?.(false);
  }

  return (
    <AlertDialog {...dialogProps}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            inventory item.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <SubmitButton
            variant="destructive"
            loading={fetcher.state !== 'idle'}
            onClick={handleSubmit}
          >
            Continue
          </SubmitButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
