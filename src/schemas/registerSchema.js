import { z } from 'zod'

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Nome é obrigatório')
      .min(3, 'Nome deve ter pelo menos 3 caracteres')
      .trim(),
    email: z
      .email('Formato de e-mail inválido')
      .min(1, 'E-mail é obrigatório')
      .toLowerCase()
      .trim(),
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