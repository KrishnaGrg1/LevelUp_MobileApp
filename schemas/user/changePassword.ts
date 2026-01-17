import z from 'zod';

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'error.auth.passwordRequired')
      .min(6, 'error.auth.passwordMinLength'),
    newPassword: z
      .string()
      .min(1, 'error.auth.passwordRequired')
      .min(6, 'error.auth.passwordMinLength'),
    confirmNewPassword: z
      .string()
      .min(1, 'error.auth.passwordRequired')
      .min(6, 'error.auth.passwordMinLength'),
  })
  .refine(data => data.newPassword === data.confirmNewPassword, {
    path: ['confirmNewPassword'],
    message: 'error.auth.passwordMismatch',
  });

export type changePasswordInput = z.infer<typeof changePasswordSchema>;
