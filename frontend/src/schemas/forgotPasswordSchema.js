import { z } from 'zod'

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'E-mail é obrigatório')
    .email('Formato de e-mail inválido')
    .toLowerCase(),
})
