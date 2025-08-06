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
import { useFetcherWithResponseHandler } from '~/hooks/useFetcherWithResponseHandler';

interface Recipe {
  id: string;
  name: string;
}

export function RecipeDeleteDialog({
  recipe,
  ...dialogProps
}: ComponentProps<typeof AlertDialog> & { recipe: Recipe }) {
  const fetcher = useFetcherWithResponseHandler();

  async function handleSubmit() {
    fetcher.submit(
      { id: recipe.id, intent: 'delete' },
      { method: 'POST', action: '/recipes', encType: 'application/json' }
    );

    dialogProps.onOpenChange?.(false);
  }

  return (
    <AlertDialog {...dialogProps}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the recipe{' '}
            <span className="font-semibold">{recipe.name}</span>.
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