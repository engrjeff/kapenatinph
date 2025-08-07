import { z } from 'zod';

export const INVENTORY_STATUS = [
  'in_stock',
  'low_stock',
  'out_of_stock',
] as const;

export const inventorySchema = z.object({
  sku: z
    .string({ error: 'SKU is required' })
    .min(1, { message: 'SKU is required' }),

  name: z
    .string({ error: 'Name is required' })
    .min(1, { message: 'Item name is required' }),

  categoryId: z
    .string({ error: 'Category is required' })
    .min(1, { message: 'Category is required' }),

  description: z
    .string()
    .max(200, { message: 'Description must be 200 characters or less' })
    .optional(),

  orderUnit: z
    .string({ error: 'Order unit is required' })
    .min(1, { message: 'Order unit is required' }),

  unit: z
    .string({ error: 'Unit is required' })
    .min(1, { message: 'Unit is required' }),

  quantity: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z
      .number({ error: 'Quantity is required' })
      .int({ error: 'Must be a whole number' })
      .nonnegative({ message: 'Quantity cannot be negative' })
  ) as unknown as z.ZodNumber,

  reorderLevel: z
    .preprocess(
      (val) => (val === '' ? undefined : Number(val)),
      z
        .int({ error: 'Must be a whole number' })
        .nonnegative({ message: 'Reorder level cannot be negative' })
    )
    .optional() as unknown as z.ZodOptional<z.ZodNumber>,

  unitPrice: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z
      .number({ error: 'Unit price is required' })
      .nonnegative({ message: 'Unit price cannot be negative' })
  ) as unknown as z.ZodNumber,

  amountPerUnit: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z
      .number({ error: 'Amount per unit is required' })
      .nonnegative({ message: 'Amount per unit cannot be negative' })
  ) as unknown as z.ZodNumber,

  supplier: z
    .string()
    .max(100, { message: 'Supplier name must be 100 characters or less' })
    .optional(),
});

export const createInventorySchema = inventorySchema.extend({
  intent: z.literal('create'),
});

export type InventoryInputs = z.infer<typeof inventorySchema>;

export const updateInventorySchema = inventorySchema.extend({
  intent: z.literal('update'),
  id: z.string({ error: 'Inventory item id is required.' }),
});

export const deleteInventorySchema = z.object({
  intent: z.literal('delete'),
  id: z.string({ error: 'Inventory item id is required.' }),
});
