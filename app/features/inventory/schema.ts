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

  quantity: z
    .number({ error: 'Quantity is required' })
    .int({ error: 'Must be a number' })
    .nonnegative({ message: 'Quantity cannot be negative' }),

  reorderLevel: z
    .int({ error: 'Must be a number' })
    .nonnegative({ message: 'Reorder level cannot be negative' }),

  unitPrice: z
    .number({ error: 'Unit price is required' })
    .gt(0, { error: 'Must be greater than 0' })
    .nonnegative({ message: 'Unit price cannot be negative' }),

  amountPerUnit: z
    .number({ error: 'Amount per unit is required' })
    .gt(1, { error: 'Must be greater than 0' })
    .nonnegative({ message: 'Amount per unit cannot be negative' }),

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
