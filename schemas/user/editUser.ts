// schemas/registerSchema.ts
import { z } from 'zod';

export const editProfileSchema = z.object({
  username: z
    .string()
    .min(1, { message: 'error.auth.usernameRequired' })
    .min(3, { message: 'error.auth.usernameMinLength' }),
});
export type editProfileInput = z.infer<typeof editProfileSchema>;
