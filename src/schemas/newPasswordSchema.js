import { z } from 'zod'

export const newPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, 'Senha é obrigatória')
      .min(6, 'Mínimo 6 caracteres'),
    confirmPassword: z
      .string()
      .min(1, 'Confirmação de senha é obrigatória'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })
