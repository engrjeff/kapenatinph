import { zodResolver } from '@hookform/resolvers/zod';
import { RotateCwIcon } from 'lucide-react';
import {
  useForm,
  type SubmitErrorHandler,
  type SubmitHandler,
} from 'react-hook-form';
import { useFetcher } from 'react-router';
import { Button } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { NumberInput } from '~/components/ui/number-input';
import { SelectNative } from '~/components/ui/select-native';
import { SubmitButton } from '~/components/ui/submit-button';
import { Textarea } from '~/components/ui/textarea';
import type { Category, Inventory } from '~/generated/prisma/client';
import { COMMON_UNITS } from '~/lib/constants';
import { generateSku } from '~/lib/utils';
import { inventorySchema, type InventoryInputs } from './schema';

export interface InventoryFormProps {
  initialValue?: Inventory | null;
  categories: Category[];
  isEditing?: boolean;
}

export function InventoryForm({
  initialValue,
  categories,
  isEditing = false,
}: InventoryFormProps) {
  const form = useForm<InventoryInputs>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      name: isEditing ? initialValue?.name ?? '' : initialValue?.name ? initialValue?.name + ' Copy' : '',
      sku: isEditing ? initialValue?.sku ?? '' : '',
      description: initialValue?.description ?? '',
      categoryId: initialValue?.categoryId ?? '',
      unit: initialValue?.unit ?? '',
      quantity: initialValue?.quantity ?? undefined,
      reorderLevel: initialValue?.reorderLevel ?? undefined,
      costPrice: initialValue?.costPrice ?? undefined,
      supplier: initialValue?.supplier ?? '',
    },
  });

  const fetcher = useFetcher();

  const isLoading = fetcher.state !== 'idle';

  const onError: SubmitErrorHandler<InventoryInputs> = (errors) => {
    console.log(`Inventory Form Errors: `, errors);
  };

  const onSubmit: SubmitHandler<InventoryInputs> = async (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, String(value));
      }
    });

    if (isEditing && initialValue?.id) {
      formData.append('intent', 'update');
      formData.append('id', initialValue.id);
      fetcher.submit(formData, { method: 'POST', action: '/inventory' });
    } else {
      formData.append('intent', 'create');
      fetcher.submit(formData, { method: 'POST', action: '/inventory' });
    }
  };

  return (
    <Form {...form}>
      <form
        noValidate
        className="pb-6"
        onSubmit={form.handleSubmit(onSubmit, onError)}
      >
        <fieldset
          disabled={isLoading}
          className="space-y-4 disabled:opacity-90"
        >
          <p className="font-semibold text-sm">Basic Info</p>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input autoFocus placeholder="Item name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <SelectNative {...field}>
                    <option value="">Select a category</option>
                    {categories?.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </SelectNative>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 items-start">
            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input placeholder="SKU" {...field} />
                    </FormControl>
                    <Button
                      type="button"
                      size="icon"
                      variant="secondary"
                      className="absolute inset-y-1 end-1 size-7 disabled:cursor-not-allowed"
                      title="click to generate SKU"
                      onClick={async (e) => {
                        e.stopPropagation();
                        const skuValue = generateSku(form.watch('name'));
                        form.setValue('sku', skuValue);
                        await form.trigger('sku');
                      }}
                    >
                      <span className="sr-only">generate sku</span>
                      <RotateCwIcon className="size-4" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <FormControl>
                    <SelectNative {...field}>
                      <option value="">Select a unit</option>
                      {COMMON_UNITS.map((unit) => (
                        <option key={`common-unit-${unit}`} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </SelectNative>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <p className="font-semibold text-sm">Quantity & Pricing</p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 items-start">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <NumberInput
                      step={1}
                      min={0}
                      noDecimal
                      placeholder="0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="costPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost</FormLabel>
                  <FormControl>
                    <NumberInput step={1} min={0} placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="reorderLevel"
            render={({ field }) => (
              <FormItem className="grid grid-cols-2 gap-x-4 space-y-0">
                <div className="space-y-2">
                  <FormLabel>Reorder Level (Optional)</FormLabel>
                  <FormControl>
                    <NumberInput
                      step={1}
                      min={0}
                      noDecimal
                      placeholder="0"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormDescription className="col-span-2">
                  The amount at which this item is considered as low in stock.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <p className="font-semibold text-sm">Supplier Info</p>
          <FormField
            control={form.control}
            name="supplier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supplier (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Supplier" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-6 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <SubmitButton loading={isLoading}>Save</SubmitButton>
          </div>
        </fieldset>
      </form>
    </Form>
  );
}
