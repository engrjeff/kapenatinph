import { zodResolver } from '@hookform/resolvers/zod';
import { DialogClose, DialogTrigger } from '@radix-ui/react-dialog';
import { PlusIcon } from 'lucide-react';
import { useState, type ComponentProps } from 'react';
import {
  useForm,
  type SubmitErrorHandler,
  type SubmitHandler,
} from 'react-hook-form';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { SubmitButton } from '~/components/ui/submit-button';
import { Textarea } from '~/components/ui/textarea';
import type { ProductCategory } from '~/generated/prisma/client';
import { useFetcherWithResponseHandler } from '~/hooks/useFetcherWithResponseHandler';
import { productCategorySchema, type ProductCategoryInputs } from './schema';

interface ProductCategoryDialogProps extends ComponentProps<typeof Dialog> {
  category?: ProductCategory;
  mode: 'create' | 'edit';
}

export function ProductCategoryDialog({
  category,
  mode,
  ...dialogProps
}: ProductCategoryDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<ProductCategoryInputs>({
    resolver: zodResolver(productCategorySchema),
    defaultValues: {
      name: category?.name ?? '',
      description: category?.description ?? '',
    },
  });

  const fetcher = useFetcherWithResponseHandler({
    form,
    redirectTo: '/product-categories',
  });

  const isLoading = fetcher.state !== 'idle';

  const onError: SubmitErrorHandler<ProductCategoryInputs> = (errors) => {
    console.log(`Product Category Form Errors: `, errors);
  };

  const onSubmit: SubmitHandler<ProductCategoryInputs> = async (data) => {
    const submitData = {
      ...data,
      intent: mode === 'edit' ? 'update' : 'create',
      ...(mode === 'edit' && category?.id && { id: category.id }),
    };

    // Submit JSON data instead of FormData to preserve types
    fetcher.submit(submitData, {
      method: 'POST',
      action: '/product-categories',
      encType: 'application/json',
    });

    dialogProps?.onOpenChange?.(false);

    setOpen(false);

    form.reset();
  };

  return (
    <Dialog
      open={dialogProps.open ?? open}
      onOpenChange={dialogProps.onOpenChange ?? setOpen}
      {...dialogProps}
    >
      {mode === 'create' ? (
        <DialogTrigger asChild>
          <Button size="sm">
            <PlusIcon /> Add Category
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create Category' : 'Edit Category'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Add a new product category to organize your products.'
              : 'Update the category details.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            noValidate
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="space-y-4"
          >
            <fieldset
              disabled={isLoading}
              className="space-y-4 disabled:opacity-90"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input autoFocus placeholder="Category name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Category description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-end gap-3 pt-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <SubmitButton loading={isLoading}>
                  {mode === 'create' ? 'Create' : 'Update'} Category
                </SubmitButton>
              </div>
            </fieldset>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
