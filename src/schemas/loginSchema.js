import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .email('Formato de e-mail inválido')
    .min(1, 'O e-mail é obrigatório')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, 'A senha é obrigatória')
    .min(6, 'Mínimo 6 caracteres'),
  rememberMe: z
    .boolean()
    .optional(),
})