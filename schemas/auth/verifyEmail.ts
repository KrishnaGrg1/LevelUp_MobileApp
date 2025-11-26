import z from 'zod';

export const VerifySchema = z.object({
  otp: z
    .string()
    .min(1, { message: 'error.auth.otpRequired' })
    .length(6, { message: 'error.auth.otpLength' }),
  userId: z.string().min(1, { message: 'error.auth.userIdRequired' }),
});

export type VerifyInput = z.infer<typeof VerifySchema>;