import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon, XIcon } from 'lucide-react';
import {
  useFieldArray,
  useForm,
  type SubmitErrorHandler,
  type SubmitHandler,
} from 'react-hook-form';
import { Button } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { NumberInput } from '~/components/ui/number-input';
import { SelectNative } from '~/components/ui/select-native';
import { Separator } from '~/components/ui/separator';
import { SubmitButton } from '~/components/ui/submit-button';
import { Switch } from '~/components/ui/switch';
import { Textarea } from '~/components/ui/textarea';
import { useFetcherWithResponseHandler } from '~/hooks/useFetcherWithResponseHandler';
import { cn } from '~/lib/utils';
import { recipeSchema, type RecipeInputs } from './schema';

interface RecipeFormProps {
  initialValue?: {
    id?: string;
    name: string;
    description?: string | null;
    instructions?: string | null;
    prepTimeMinutes?: number | null;
    productId?: string | null;
    productVariantId?: string | null;
    isActive: boolean;
    ingredients: Array<{
      inventoryId: string;
      quantity: number;
      unit: string;
      notes?: string | null;
      inventory: { id: string; name: string; unit: string };
    }>;
  };
  products?: Array<{
    id: string;
    name: string;
    hasVariants: boolean;
    variants?: Array<{ id: string; title: string }>;
  }>;
  inventoryItems?: Array<{
    id: string;
    name: string;
    unit: string;
    unitPrice: number;
  }>;
  isEditing?: boolean;
  isDuplicating?: boolean;
}

export function RecipeForm({
  initialValue,
  products = [],
  inventoryItems = [],
  isEditing = false,
  isDuplicating = false,
}: RecipeFormProps) {
  const form = useForm<RecipeInputs>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      name: isDuplicating ? '' : (initialValue?.name ?? ''),
      description: initialValue?.description ?? '',
      instructions: initialValue?.instructions ?? '',
      prepTimeMinutes: initialValue?.prepTimeMinutes ?? undefined,
      productId: initialValue?.productId ?? undefined,
      productVariantId: initialValue?.productVariantId ?? undefined,
      isActive: initialValue?.isActive ?? true,
      ingredients: initialValue?.ingredients?.map((ing) => ({
        inventoryId: ing.inventoryId,
        quantity: ing.quantity,
        unit: ing.unit,
        notes: ing.notes ?? '',
      })) ?? [
        { inventoryId: '', quantity: 0, unit: '', notes: '' },
        { inventoryId: '', quantity: 0, unit: '', notes: '' },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'ingredients',
  });

  const fetcher = useFetcherWithResponseHandler<RecipeInputs>({
    redirectTo: '/recipes',
    form,
  });

  const isLoading = fetcher.state !== 'idle';

  const watchedProductId = form.watch('productId');
  const selectedProduct = products.find((p) => p.id === watchedProductId);
  const availableVariants = selectedProduct?.variants || [];

  const onError: SubmitErrorHandler<RecipeInputs> = (errors) => {
    console.log(`Recipe Form Errors: `, errors);
  };

  const onSubmit: SubmitHandler<RecipeInputs> = async (data) => {
    const submitData = {
      ...data,
      intent: isEditing ? 'update' : 'create',
      ...(isEditing && initialValue?.id && { id: initialValue.id }),
    };

    fetcher.submit(submitData, {
      method: 'POST',
      action: '/recipes',
      encType: 'application/json',
    });
  };

  const addIngredient = () => {
    append({ inventoryId: '', quantity: 0, unit: '', notes: '' });
  };

  // Auto-populate unit when inventory item is selected
  const handleInventoryChange = (inventoryId: string, index: number) => {
    const selectedItem = inventoryItems.find((item) => item.id === inventoryId);
    if (selectedItem) {
      form.setValue(`ingredients.${index}.unit`, selectedItem.unit);
    }
  };

  // Reset variant when product changes
  const handleProductChange = (productId: string) => {
    if (!selectedProduct?.hasVariants || selectedProduct.id !== productId) {
      form.setValue('productVariantId', undefined);
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
          className="space-y-6 disabled:opacity-90"
        >
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Basic Information</h3>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipe Name</FormLabel>
                  <FormControl>
                    <Input
                      autoFocus
                      placeholder="e.g., Cafe Latte"
                      {...field}
                    />
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
                    <Textarea
                      placeholder="Brief description of the recipe"
                      rows={2}
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="prepTimeMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prep Time (minutes)</FormLabel>
                    <FormControl>
                      <NumberInput
                        placeholder="5"
                        min={1}
                        {...field}
                        value={field.value ?? ''}
                        onChange={(value) => field.onChange(value || undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructions (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Step-by-step preparation instructions"
                      rows={4}
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Recipe</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Make this recipe available for use
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* Product Association */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-sm">Product Association</h3>
              <p className="text-xs text-muted-foreground">
                Link this recipe to an existing product (optional)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product</FormLabel>
                    <FormControl>
                      <SelectNative
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => {
                          field.onChange(e.target.value || undefined);
                          handleProductChange(e.target.value);
                        }}
                      >
                        <option value="">Select a product (optional)</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                      </SelectNative>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedProduct?.hasVariants && availableVariants.length > 0 && (
                <FormField
                  control={form.control}
                  name="productVariantId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Variant</FormLabel>
                      <FormControl>
                        <SelectNative
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) =>
                            field.onChange(e.target.value || undefined)
                          }
                        >
                          <option value="">Select a variant (optional)</option>
                          {availableVariants.map((variant) => (
                            <option key={variant.id} value={variant.id}>
                              {variant.title}
                            </option>
                          ))}
                        </SelectNative>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>

          <Separator />

          {/* Ingredients */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm">Ingredients</h3>
                <p className="text-xs text-muted-foreground">
                  Add the ingredients and quantities needed for this recipe
                </p>
                {form.formState.errors?.ingredients?.root?.message ? (
                  <p className="text-destructive text-sm">
                    {form.formState.errors?.ingredients?.root?.message}
                  </p>
                ) : null}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addIngredient}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>

            <div className="space-y-3 border rounded-lg p-4 ">
              {fields.map((field, index) => (
                <div key={field.id}>
                  <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_36px] gap-3 items-end">
                    <FormField
                      control={form.control}
                      name={`ingredients.${index}.inventoryId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            className={cn(index === 0 ? 'text-xs' : 'hidden')}
                          >
                            Inventory Item
                          </FormLabel>
                          <FormControl>
                            <SelectNative
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                handleInventoryChange(e.target.value, index);
                              }}
                            >
                              <option value="">Select item</option>
                              {inventoryItems.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                              ))}
                            </SelectNative>
                          </FormControl>
                          <FormMessage className="sr-only" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`ingredients.${index}.quantity`}
                      render={() => (
                        <FormItem>
                          <FormLabel
                            className={cn(index === 0 ? 'text-xs' : 'hidden')}
                          >
                            Quantity
                          </FormLabel>
                          <FormControl>
                            <NumberInput
                              placeholder="0"
                              step={0.01}
                              min={0}
                              {...form.register(
                                `ingredients.${index}.quantity`,
                                { valueAsNumber: true }
                              )}
                            />
                          </FormControl>
                          <FormMessage className="sr-only" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`ingredients.${index}.unit`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            className={cn(index === 0 ? 'text-xs' : 'hidden')}
                          >
                            Unit
                          </FormLabel>
                          <FormControl>
                            <Input {...field} readOnly />
                          </FormControl>
                          <FormMessage className="sr-only" />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="shrink-0 bg-accent border-input"
                      onClick={() => remove(index)}
                      disabled={fields.length <= 2} // requires at least 2 ingredients
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* <FormField
                    control={form.control}
                    name={`ingredients.${index}.notes`}
                    render={({ field }) => (
                      <FormItem className="hidden">
                        <FormLabel className="text-xs">
                          Notes (Optional)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Optional notes about this ingredient"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 flex items-center justify-end gap-3">
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              <SubmitButton loading={isLoading}>
                {isEditing ? 'Update' : 'Create'} Recipe
              </SubmitButton>
            </div>
          </div>
        </fieldset>
      </form>
    </Form>
  );
}
