import { z } from 'zod';

export const createStoreSchema = z.object({
  name: z
    .string({ message: 'Store name is required.' })
    .min(1, { message: 'Store name is required.' }),

  address: z
    .string({ message: 'Address is required.' })
    .min(1, { message: 'Address is required.' }),

  email: z.email({ message: 'Provide a valid email.' }).trim(),

  phone: z.string({ message: 'Phone number is required.' }).trim(),

  logoUrl: z
    .union([z.literal(''), z.url({ message: 'Invalid logo.' }).trim()])
    .optional(),

  website: z
    .union([
      z.literal(''),
      z.string().trim().url({ message: 'Invalid website URL.' }),
    ])
    .optional(),
});

export type CreateStoreInputs = z.infer<typeof createStoreSchema>;
