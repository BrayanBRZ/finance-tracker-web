import { z } from 'zod'
import { strongPasswordSchema } from '@/schemas/passwordSchema'

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Nome é obrigatório')
      .min(3, 'Nome deve ter pelo menos 3 caracteres'),
    email: z
      .string()
      .trim()
      .min(1, 'E-mail é obrigatório')
      .email('Formato de e-mail inválido')
      .toLowerCase(),
    password: strongPasswordSchema,
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })
