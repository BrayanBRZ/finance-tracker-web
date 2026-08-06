import { z } from 'zod'
import { isKnownFinancialType } from '@/domain/financialTypes'
import { isFutureDateInputValue, isValidDateInputValue } from '@/utils/dates'

export const transactionSchema = z.object({
  categoryId: z.string(),
  type: z.string().refine(isKnownFinancialType, 'Selecione um tipo válido'),
  description: z.string().trim().max(500, 'A descrição deve ter no máximo 500 caracteres'),
  amount: z.coerce
    .number('Informe um valor válido')
    .min(0.01, 'O valor deve ser maior que zero'),
  date: z
    .string()
    .refine(isValidDateInputValue, 'Informe uma data válida')
    .refine((value) => !isFutureDateInputValue(value), 'A data não pode estar no futuro'),
})
