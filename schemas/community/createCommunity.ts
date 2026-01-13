import { z } from 'zod';

export const createCommunitySchema = z.object({
  communityName: z.string().min(3, 'Name must be at least 3 characters'), // Matches Backend
  description: z.string().max(500).optional(),
  memberLimit: z.number().min(1).max(1000).optional(),
  isPrivate: z.boolean(),
  photo: z.string().optional(),
});

export type CreateCommunityInput = z.infer<typeof createCommunitySchema>;
