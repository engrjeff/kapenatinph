import { zodResolver } from '@hookform/resolvers/zod';
import {
  useForm,
  type SubmitErrorHandler,
  type SubmitHandler,
} from 'react-hook-form';
import { useFetcher } from 'react-router';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { productCategorySchema, type ProductCategoryInputs } from './schema';
import { useState } from 'react';

interface ProductCategoryDialogProps {
  trigger: React.ReactNode;
  category?: ProductCategory;
  mode: 'create' | 'edit';
}

export function ProductCategoryDialog({ 
  trigger, 
  category, 
  mode 
}: ProductCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  
  const form = useForm<ProductCategoryInputs>({
    resolver: zodResolver(productCategorySchema),
    defaultValues: {
      name: category?.name ?? '',
      description: category?.description ?? '',
    },
  });

  const fetcher = useFetcher();
  const isLoading = fetcher.state !== 'idle';

  const onError: SubmitErrorHandler<ProductCategoryInputs> = (errors) => {
    console.log(`Product Category Form Errors: `, errors);
  };

  const onSubmit: SubmitHandler<ProductCategoryInputs> = async (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, String(value));
      }
    });

    if (mode === 'edit' && category?.id) {
      formData.append('intent', 'update');
      formData.append('id', category.id);
    } else {
      formData.append('intent', 'create');
    }

    fetcher.submit(formData, { method: 'POST', action: '/product-categories' });
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create Category' : 'Edit Category'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Add a new product category to organize your products.'
              : 'Update the category details.'
            }
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setOpen(false);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
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