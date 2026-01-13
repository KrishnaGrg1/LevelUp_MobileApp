import z from 'zod';

export const ForgetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'error.auth.emailRequired' })
    .email({ message: 'error.auth.emailInvalid' }),
});

export type ForgetPasswordInput = z.infer<typeof ForgetPasswordSchema>;
