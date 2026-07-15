import { hasText } from '@/mocks/utils/text'

const datePattern = /^\d{4}-\d{2}-\d{2}$/

export function validateTransactionInput({ description, amount, transactionDate }) {
  if (!hasText(description)) {
    throw new Error('A descrição da transação é obrigatória')
  }

  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
    throw new Error('O valor deve ser maior que zero')
  }

  if (!datePattern.test(transactionDate)) {
    throw new Error('Informe uma data válida')
  }

  const parsedDate = new Date(`${transactionDate}T00:00:00`)

  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== transactionDate
  ) {
    throw new Error('Informe uma data válida')
  }
}
