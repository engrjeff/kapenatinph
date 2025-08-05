import { z } from 'zod';

// Variant option value schema (e.g., "8oz", "Hot")
export const variantOptionValueSchema = z.object({
  value: z
    .string({ error: 'Option value is required' })
    .min(1, { message: 'Option value is required' }),
  position: z.number(),
});

// Variant option schema (e.g., "Size", "Temperature")
export const variantOptionSchema = z.object({
  name: z
    .string({ error: 'Option name is required' })
    .min(1, { message: 'Option name is required' }),
  position: z.number(),
  values: z
    .array(variantOptionValueSchema)
    .min(1, { message: 'At least one option value is required' })
    .superRefine((items, ctx) => {
      const uniqueItemsCount = new Set(
        items.map((item) => item.value.toLowerCase())
      ).size;
      const errorPosition = items.length - 1;

      const target = items[errorPosition];

      if (uniqueItemsCount !== items.length) {
        ctx.addIssue({
          code: 'custom',
          message: `${target.value} already exists.`,
          path: [errorPosition, 'value'],
        });
      }
    }),
});

// Individual variant schema (e.g., "8oz / Hot")
export const productVariantSchema = z.object({
  title: z
    .string({ error: 'Variant title is required' })
    .min(1, { message: 'Variant title is required' }),
  sku: z
    .string({ error: 'SKU is required' })
    .min(1, { message: 'SKU is required' }),
  price: z
    .preprocess(
      (val) => (val === '' ? undefined : Number(val)),
      z
        .number({ error: 'Price must be a number' })
        .nonnegative({ message: 'Price cannot be negative' })
    )
    .optional() as unknown as z.ZodOptional<z.ZodNumber>,
  isDefault: z.boolean(),
  isAvailable: z.boolean(),
  optionValues: z.array(z.string()), // Array of option value IDs
});

export const productSchema = z
  .object({
    name: z
      .string({ error: 'Product name is required' })
      .min(1, { message: 'Product name is required' }),
    description: z
      .string()
      .max(1000, { message: 'Description must be 1000 characters or less' })
      .optional(),
    categoryId: z
      .string({ error: 'Category is required' })
      .min(1, { message: 'Category is required' }),
    basePrice: z.preprocess(
      (val) => (val === '' ? undefined : Number(val)),
      z
        .number({ error: 'Base price is required' })
        .nonnegative({ message: 'Base price cannot be negative' })
    ) as unknown as z.ZodNumber,
    sku: z.string().optional(), // SKU for products without variants
    isActive: z.boolean(),
    hasVariants: z.boolean(),
    variantOptions: z.array(variantOptionSchema).superRefine((items, ctx) => {
      const uniqueItemsCount = new Set(
        items.map((item) => item.name.toLowerCase())
      ).size;
      const errorPosition = items.length - 1;

      const target = items[errorPosition];

      if (uniqueItemsCount !== items.length) {
        ctx.addIssue({
          code: 'custom',
          message: `${target.name} already exists.`,
          path: [errorPosition, 'name'],
        });
      }
    }),
    variants: z.array(productVariantSchema),
  })
  .refine(
    (data) => {
      // If no variants, SKU is required
      if (!data.hasVariants) {
        return data.sku && data.sku.length > 0;
      }
      return true;
    },
    {
      message: 'SKU is required when product has no variants',
      path: ['sku'],
    }
  );

export const createProductSchema = productSchema.extend({
  intent: z.literal('create'),
});

export const updateProductSchema = productSchema.extend({
  intent: z.literal('update'),
  id: z.string({ error: 'Product id is required.' }),
});

export const deleteProductSchema = z.object({
  intent: z.literal('delete'),
  id: z.string({ error: 'Product id is required.' }),
});

export type VariantOptionValueInputs = z.infer<typeof variantOptionValueSchema>;
export type VariantOptionInputs = z.infer<typeof variantOptionSchema>;
export type ProductVariantInputs = z.infer<typeof productVariantSchema>;
export type ProductInputs = z.infer<typeof productSchema>;
