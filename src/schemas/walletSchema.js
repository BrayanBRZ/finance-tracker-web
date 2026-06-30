import { z } from 'zod'

export const walletSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nome da carteira é obrigatório')
    .min(3, 'Nome da carteira deve ter pelo menos 3 caracteres'),
  description: z.string().trim(),
})
