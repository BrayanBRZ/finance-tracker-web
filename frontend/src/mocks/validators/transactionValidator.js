import { isKnownFinancialType } from '@/domain/financialTypes'
import { hasText } from '@/mocks/utils/text'
import { isFutureDateInputValue, isValidDateInputValue } from '@/utils/dates'

export function validateTransactionInput({
  description,
  amount,
  type,
  transactionDate,
}) {
  if (!hasText(description)) {
    throw new Error('A descrição da transação é obrigatória')
  }

  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
    throw new Error('O valor deve ser maior que zero')
  }

  if (!isKnownFinancialType(type)) {
    throw new Error('Selecione um tipo de transação válido')
  }

  if (!isValidDateInputValue(transactionDate)) {
    throw new Error('Informe uma data válida')
  }

  if (isFutureDateInputValue(transactionDate)) {
    throw new Error('A data da transação não pode estar no futuro')
  }
}
