import { z } from 'zod'

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
    password: z
      .string()
      .min(1, 'Senha é obrigatória')
      .min(6, 'Mínimo 6 caracteres'),
    confirmPassword: z
      .string()
      .min(1, 'Confirmação de senha é obrigatória'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })
