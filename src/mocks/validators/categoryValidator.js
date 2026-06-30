import { isKnownFinancialType } from '@/mocks/models/categoryModel'
import { hasText } from '@/mocks/utils/text'

export function validateCategoryInput({ name, type }) {
  if (!hasText(name)) {
    throw new Error('O nome da categoria é obrigatório')
  }

  if (!isKnownFinancialType(type)) {
    throw new Error('Tipo de categoria inválido')
  }
}
