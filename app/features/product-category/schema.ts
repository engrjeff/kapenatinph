import { z } from 'zod';

export const productCategorySchema = z.object({
  name: z
    .string({ error: 'Category name is required' })
    .min(1, { message: 'Category name is required' }),
  description: z
    .string()
    .max(500, { message: 'Description must be 500 characters or less' })
    .optional(),
});

export const createProductCategorySchema = productCategorySchema.extend({
  intent: z.literal('create'),
});

export const updateProductCategorySchema = productCategorySchema.extend({
  intent: z.literal('update'),
  id: z.string({ error: 'Category id is required.' }),
});

export const deleteProductCategorySchema = z.object({
  intent: z.literal('delete'),
  id: z.string({ error: 'Category id is required.' }),
});

export type ProductCategoryInputs = z.infer<typeof productCategorySchema>;
