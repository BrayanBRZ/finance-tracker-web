import { z } from 'zod'
import { isKnownFinancialType } from '@/domain/financialTypes'

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nome da categoria é obrigatório')
    .max(80, 'Nome da categoria deve ter no máximo 80 caracteres'),
  type: z.string().refine(isKnownFinancialType, 'Selecione um tipo de categoria válido'),
  color: z.string().trim().regex(/^#[0-9A-Fa-f]{6}$/, 'Selecione uma cor válida'),
  icon: z.string().trim().min(1, 'Selecione um ícone').max(120),
})
