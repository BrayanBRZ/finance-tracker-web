import { z } from 'zod'

export const walletSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'O nome da carteira é obrigatório')
    .max(120, 'O nome deve ter no máximo 120 caracteres'),
  description: z.string().trim().max(500, 'A descrição deve ter no máximo 500 caracteres'),
})
