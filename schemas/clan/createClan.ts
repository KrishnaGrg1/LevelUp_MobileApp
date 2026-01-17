import { z } from 'zod';

export const createClanSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  communityId: z.string(),
  description: z.string().max(500).optional(),
  limit: z.number().min(1).max(1000).optional(),
  isPrivate: z.boolean(),
});

export type CreateClanInputSchema = z.infer<typeof createClanSchema>;
