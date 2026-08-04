import { z } from 'zod'
import { isKnownFinancialType } from '@/domain/financialTypes'

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nome da categoria é obrigatório')
    .min(2, 'Nome da categoria deve ter pelo menos 2 caracteres'),
  type: z
    .string()
    .refine(isKnownFinancialType, 'Selecione um tipo de categoria válido'),
  color: z.string().trim().min(1, 'Selecione uma cor'),
  icon: z.string().trim().min(1, 'Selecione um ícone'),
})
