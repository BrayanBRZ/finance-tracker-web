import { z } from 'zod'
import { isKnownFinancialType } from '@/domain/financialTypes'

export const transactionSchema = z.object({
  categoryId: z.string(),
  type: z.string().refine(isKnownFinancialType, 'Selecione um tipo válido'),
  description: z
    .string()
    .trim()
    .min(1, 'A descrição é obrigatória'),
  amount: z.coerce
    .number('Informe um valor válido')
    .positive('O valor deve ser maior que zero'),
  transactionDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Informe uma data válida'),
})
