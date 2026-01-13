import z from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'error.auth.emailRequired')
    .email({ message: 'error.auth.emailInvalid' }),
  password: z.string().min(1, 'error.auth.passwordRequired').min(6, 'error.auth.passwordMinLength'),
});

export type LoginInput = z.infer<typeof loginSchema>;
