import { z } from 'zod';

export const storeSchema = z.object({
  name: z
    .string({ error: 'Store name is required' })
    .min(1, { message: 'Store name is required' }),

  address: z
    .string({ error: 'Address is required' })
    .min(1, { message: 'Address is required' }),

  email: z
    .string({ error: 'Email is required' })
    .email({ message: 'Provide a valid email' })
    .trim(),

  phone: z
    .string({ error: 'Phone number is required' })
    .min(1, { message: 'Phone number is required' })
    .trim(),

  logoUrl: z
    .union([z.literal(''), z.url({ message: 'Invalid logo URL' }).trim()])
    .optional(),

  website: z
    .union([
      z.literal(''),
      z.string().trim().url({ message: 'Invalid website URL' }),
    ])
    .optional(),
});

export const createStoreSchema = storeSchema.extend({
  intent: z.literal('create'),
});

export const updateStoreSchema = storeSchema.extend({
  intent: z.literal('update'),
  id: z.string({ error: 'Store id is required.' }),
});

export const deleteStoreSchema = z.object({
  intent: z.literal('delete'),
  id: z.string({ error: 'Store id is required.' }),
});

export type StoreInputs = z.infer<typeof storeSchema>;
export type CreateStoreInputs = z.infer<typeof createStoreSchema>;
