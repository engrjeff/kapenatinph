import { z } from 'zod';

export const recipeIngredientSchema = z.object({
  inventoryId: z
    .string({ error: 'Inventory item is required' })
    .min(1, { message: 'Inventory item is required' }),

  quantity: z
    .number({ error: 'Quantity is required' })
    .gt(0, { error: 'Quantity must be greater than zero' })
    .nonnegative({ message: 'Quantity cannot be negative' }),

  unit: z.string(),

  notes: z
    .string()
    .max(200, { message: 'Notes must be 200 characters or less' })
    .optional(),
});

export const recipeSchema = z.object({
  name: z
    .string({ error: 'Recipe name is required' })
    .min(1, { message: 'Recipe name is required' })
    .max(100, { message: 'Recipe name must be 100 characters or less' }),

  description: z
    .string()
    .max(500, { message: 'Description must be 500 characters or less' })
    .optional(),

  instructions: z
    .string()
    .max(1000, { message: 'Instructions must be 1000 characters or less' })
    .optional(),

  prepTimeMinutes: z
    .preprocess(
      (val) => (val === '' ? undefined : Number(val)),
      z
        .number({ error: 'Must be a valid number' })
        .nonnegative({ message: 'Prep time cannot be negative' })
    )
    .optional() as unknown as z.ZodOptional<z.ZodNumber>,

  productId: z.string({ error: 'Product is required' }),
  productVariantId: z.string().optional(),

  isActive: z.boolean(),

  ingredients: z
    .array(recipeIngredientSchema)
    .min(2, { message: 'At least two ingredients are required' })
    .superRefine((items, ctx) => {
      const uniqueItemsCount = new Set(
        items.map((item) => item.inventoryId.toLowerCase())
      ).size;
      const errorPosition = items.length - 1;

      const target = items[errorPosition];

      if (uniqueItemsCount !== items.length) {
        ctx.addIssue({
          code: 'custom',
          message: `${target.inventoryId} already exists.`,
          path: [errorPosition, 'inventoryId'],
        });
      }
    }),
});

export const createRecipeSchema = recipeSchema.extend({
  intent: z.literal('create'),
});

export type RecipeInputs = z.infer<typeof recipeSchema>;
export type RecipeIngredientInputs = z.infer<typeof recipeIngredientSchema>;

export const updateRecipeSchema = recipeSchema.extend({
  intent: z.literal('update'),
  id: z.string({ error: 'Recipe id is required.' }),
});

export const deleteRecipeSchema = z.object({
  intent: z.literal('delete'),
  id: z.string({ error: 'Recipe id is required.' }),
});
