import { zodResolver } from '@hookform/resolvers/zod';
import {
  GripVerticalIcon,
  PlusIcon,
  RotateCwIcon,
  TrashIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
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
import type { ProductCategory } from '~/generated/prisma/client';
import { useFetcherWithResponseHandler } from '~/hooks/useFetcherWithResponseHandler';
import { generateSku } from '~/lib/utils';
import {
  updateProductSchema,
  type ProductInputs,
  type UpdateProductInputs,
  type VariantOptionInputs,
} from './schema';
import type { ProductData } from './service';

export interface ProductEditFormProps {
  product: ProductData;
  categories: ProductCategory[];
}

export function ProductEditForm({
  product: initialValue,
  categories,
}: ProductEditFormProps) {
  // console.log(initialValue);

  const [hasVariants, setHasVariants] = useState(
    initialValue?.hasVariants ?? false
  );

  const form = useForm<UpdateProductInputs>({
    mode: 'onChange',
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      intent: 'update',
      id: initialValue.id,
      name: initialValue.name ?? '',
      description: initialValue.description ?? '',
      categoryId: initialValue.categoryId ?? '',
      sku: initialValue.sku ?? '',
      basePrice: initialValue.basePrice ?? undefined,
      isActive: initialValue.isActive ?? true,
      hasVariants: initialValue.hasVariants ?? false,
      variantOptions: initialValue.variantOptions ?? [],
      variants:
        initialValue.variants?.map((v) => ({
          id: v?.id,
          isAvailable: v.isAvailable,
          isDefault: v.isDefault,
          price: v.price,
          title: v.title,
          sku: v.sku,
        })) ?? [],
    },
  });

  const formErrors = form.formState.errors;

  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control: form.control,
    name: 'variantOptions',
  });

  const { fields: variantFields, replace: replaceVariants } = useFieldArray({
    control: form.control,
    name: 'variants',
  });

  const fetcher = useFetcherWithResponseHandler<UpdateProductInputs>({
    redirectTo: '/products',
    form,
  });

  const isLoading = fetcher.state !== 'idle';

  // Generate variant combinations when options change
  useEffect(() => {
    const subscription = form.watch((values, { name }) => {
      if (!hasVariants) return;

      // Only regenerate when variant options change or product name changes
      if (name?.startsWith('variantOptions') || name === 'name') {
        const options = values.variantOptions || [];

        if (options.length === 0) {
          replaceVariants([]);
          return;
        }

        const currentVariantsMap = values.variants
          ? new Map<string, { price: number; id: string }>(
              values.variants.map((v) => [
                v?.title as string,
                { price: v?.price as number, id: v?.id as string },
              ])
            )
          : undefined;

        // Check if all options have valid values
        const validOptions = options.filter(
          (option) =>
            option?.name &&
            option?.values &&
            option.values.some((v) => v?.value)
        );

        if (validOptions.length === 0) {
          replaceVariants([]);
          return;
        }

        // Generate all combinations
        const combinations = generateCombinations(
          validOptions as VariantOptionInputs[]
        );
        const productName = values.name || '';

        const newVariants = combinations.map((combo) => {
          const found = currentVariantsMap?.get(combo.title);

          return {
            title: combo.title,
            id: found?.id,
            price: found?.price ?? 0,
            sku: generateSku(`${productName}-${combo.title}`),
            isDefault: false,
            isAvailable: true,
          };
        });

        replaceVariants(newVariants);
      }
    });

    return () => subscription.unsubscribe();
  }, [hasVariants, form, replaceVariants]);

  const generateCombinations = (options: VariantOptionInputs[]) => {
    if (options.length === 0) return [];

    const combinations: Array<{
      title: string;
      options: Record<string, string>;
    }> = [];

    function generateCombos(
      index: number,
      currentCombo: Record<string, string>
    ) {
      if (index === options.length) {
        const title = Object.values(currentCombo).join(' / ');
        combinations.push({ title, options: { ...currentCombo } });
        return;
      }

      const option = options[index];
      if (option.values) {
        for (const value of option.values) {
          generateCombos(index + 1, {
            ...currentCombo,
            [option.name]: value.value,
          });
        }
      }
    }

    generateCombos(0, {});
    return combinations;
  };

  const onError: SubmitErrorHandler<ProductInputs> = (errors) => {
    console.log(`Product Form Errors: `, errors);
  };

  const onSubmit: SubmitHandler<ProductInputs> = async (data) => {
    const submitData = {
      ...data,
      hasVariants,
      variantOptions: hasVariants ? data.variantOptions : [],
      variants: hasVariants ? data.variants : [],
      intent: 'update',
      id: initialValue.id,
    };

    // console.log(submitData);
    // return;

    // Submit JSON data instead of FormData to preserve types
    fetcher.submit(submitData, {
      method: 'POST',
      action: '/products',
      encType: 'application/json',
    });
  };

  const addOption = () => {
    appendOption({
      name: '',
      position: optionFields.length,
      values: [{ value: '', position: 0 }],
    });
  };

  const addValueToOption = (optionIndex: number) => {
    const currentOption = form.watch(`variantOptions.${optionIndex}`);
    const newValues = [
      ...(currentOption.values || []),
      { value: '', position: currentOption.values?.length || 0 },
    ];
    form.setValue(`variantOptions.${optionIndex}.values`, newValues);
  };

  const removeValueFromOption = (optionIndex: number, valueIndex: number) => {
    const currentOption = form.watch(`variantOptions.${optionIndex}`);
    const newValues =
      currentOption.values?.filter((_, index) => index !== valueIndex) || [];
    form.setValue(`variantOptions.${optionIndex}.values`, newValues);
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
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input autoFocus placeholder="Product name" {...field} />
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

            <div className="grid grid-cols-1 items-start md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="basePrice"
                render={() => (
                  <FormItem>
                    <FormLabel>Base Price</FormLabel>
                    <FormControl>
                      <NumberInput
                        step={0.01}
                        min={0}
                        usePeso
                        placeholder="0.00"
                        {...form.register('basePrice', { valueAsNumber: true })}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input placeholder="Product SKU" {...field} />
                      </FormControl>
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        className="absolute inset-y-1 end-1 size-7"
                        title="Click to generate SKU"
                        onClick={() => {
                          const productName = form.watch('name');
                          const newSku = generateSku(productName);
                          field.onChange(newSku);
                        }}
                      >
                        <RotateCwIcon className="size-4" />
                      </Button>
                    </div>
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
                    <Textarea placeholder="Product description" {...field} />
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
                    <FormLabel className="text-base">Active Product</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Make this product available for customers
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

          {/* Variants Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm">Product Variants</h3>
                <p className="text-xs text-muted-foreground">
                  Add options like size, color, or material to create variants
                </p>
              </div>
              <Switch
                checked={hasVariants}
                onCheckedChange={(checked) => {
                  setHasVariants(checked);
                  form.setValue('hasVariants', checked);
                  if (!checked) {
                    form.setValue('variantOptions', []);
                    form.setValue('variants', []);
                  } else {
                    // Generate default Size option for coffee shops
                    const defaultSizeOption = {
                      name: 'Size',
                      position: 0,
                      values: [
                        { value: '8oz', position: 0 },
                        { value: '12oz', position: 1 },
                        { value: '16oz', position: 2 },
                      ],
                    };
                    form.setValue('variantOptions', [defaultSizeOption]);

                    // Generate combinations immediately
                    const combinations = generateCombinations([
                      defaultSizeOption,
                    ]);
                    const productName = form.watch('name') || '';
                    const basePrice = form.watch('basePrice');
                    const newVariants = combinations.map((combo) => ({
                      title: combo.title,
                      sku: generateSku(`${productName}-${combo.title}`),
                      price: basePrice,
                      isDefault: false,
                      isAvailable: true,
                    }));
                    replaceVariants(newVariants);
                  }
                }}
              />
            </div>

            {hasVariants && (
              <div className="space-y-6">
                {/* Variant Options */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">Option Names</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addOption}
                    >
                      <PlusIcon className="size-4 mr-2" />
                      Add Option
                    </Button>
                  </div>

                  {optionFields.map((field, optionIndex) => (
                    <div
                      key={field.id}
                      className="border rounded-lg p-4 space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name={`variantOptions.${optionIndex}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-3">
                              <GripVerticalIcon className="size-4 text-muted-foreground" />
                              <FormLabel className="sr-only">
                                Option Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Option name (e.g., Size, Temperature)"
                                  {...field}
                                />
                              </FormControl>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="shrink-0"
                                aria-label="Delete option"
                                onClick={() => removeOption(optionIndex)}
                              >
                                <TrashIcon className="size-4" />
                              </Button>
                            </div>
                            <FormMessage className="ml-9" />
                          </FormItem>
                        )}
                      />

                      {/* Option Values */}
                      <div className="ml-7 space-y-2">
                        <FormLabel className="text-xs text-muted-foreground">
                          Option Values
                        </FormLabel>
                        {form
                          .watch(`variantOptions.${optionIndex}.values`)
                          ?.map((_, valueIndex) => (
                            <div
                              key={valueIndex}
                              className="flex items-center gap-2"
                            >
                              <FormField
                                control={form.control}
                                name={`variantOptions.${optionIndex}.values.${valueIndex}.value`}
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Input
                                        placeholder="Value (e.g., 8oz, Hot)"
                                        {...field}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="shrink-0"
                                aria-label="Delete option value"
                                onClick={() =>
                                  removeValueFromOption(optionIndex, valueIndex)
                                }
                              >
                                <TrashIcon className="size-4" />
                              </Button>
                            </div>
                          ))}
                        {formErrors.variantOptions?.[optionIndex]?.values?.root
                          ?.message ? (
                          <p className="text-destructive text-sm">
                            {
                              formErrors.variantOptions?.[optionIndex]?.values
                                ?.root?.message
                            }
                          </p>
                        ) : null}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                          onClick={() => addValueToOption(optionIndex)}
                        >
                          <PlusIcon className="size-3 mr-1" />
                          Add Value
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Generated Variants Preview */}
                {variantFields.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm">
                      Generated Variants ({variantFields.length})
                    </h4>
                    <div className="space-y-3">
                      {variantFields.map((field, index) => (
                        <div key={field.id} className="border rounded-lg p-3">
                          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_120px] gap-3 items-start">
                            <FormField
                              control={form.control}
                              name={`variants.${index}.title`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs">
                                    Variant
                                  </FormLabel>
                                  <FormControl>
                                    <Input readOnly {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`variants.${index}.sku`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-xs">SKU</FormLabel>
                                  <div className="relative">
                                    <FormControl>
                                      <Input placeholder="SKU" {...field} />
                                    </FormControl>
                                    <Button
                                      type="button"
                                      size="icon"
                                      variant="secondary"
                                      title="Click to generate SKU"
                                      className="absolute inset-y-1 end-1 size-7"
                                      onClick={() => {
                                        const variantTitle = form.watch(
                                          `variants.${index}.title`
                                        );
                                        const productName = form.watch('name');
                                        const newSku = generateSku(
                                          `${productName}-${variantTitle}`
                                        );

                                        field.onChange(newSku);
                                      }}
                                    >
                                      <RotateCwIcon className="size-3" />
                                    </Button>
                                  </div>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`variants.${index}.price`}
                              render={() => (
                                <FormItem>
                                  <FormLabel className="text-xs">
                                    Price
                                  </FormLabel>
                                  <FormControl>
                                    <NumberInput
                                      step={0.01}
                                      min={0}
                                      usePeso
                                      placeholder="0.0"
                                      {...form.register(
                                        `variants.${index}.price`,
                                        { valueAsNumber: true }
                                      )}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <div className="hidden items-center gap-2 w-full">
                              <FormField
                                control={form.control}
                                name={`variants.${index}.isDefault`}
                                render={({ field }) => (
                                  <FormItem className="space-y-2">
                                    <FormLabel className="text-xs">
                                      Default
                                    </FormLabel>
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
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-6 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <SubmitButton loading={isLoading}>Update Product</SubmitButton>
          </div>
        </fieldset>
      </form>
    </Form>
  );
}
