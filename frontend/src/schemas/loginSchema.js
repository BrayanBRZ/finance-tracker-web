import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'E-mail é obrigatório')
    .email('Formato de e-mail inválido')
    .toLowerCase(),
  password: z
    .string()
    .min(1, 'A senha é obrigatória')
    .min(6, 'Mínimo 6 caracteres'),
  rememberMe: z.boolean(),
})
