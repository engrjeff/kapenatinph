import type { ComponentProps } from 'react';
import { useFetcher } from 'react-router';
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

export function InventoryDeleteDialog({
  inventory,
  ...dialogProps
}: ComponentProps<typeof AlertDialog> & { inventory: Inventory }) {
  const fetcher = useFetcher();

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
          <fetcher.Form action="/inventory" method="POST">
            <SubmitButton
              variant="destructive"
              loading={fetcher.state !== 'idle'}
            >
              Continue
            </SubmitButton>
            <input type="hidden" hidden name="intent" defaultValue="delete" />
            <input type="hidden" hidden name="id" defaultValue={inventory.id} />
          </fetcher.Form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
