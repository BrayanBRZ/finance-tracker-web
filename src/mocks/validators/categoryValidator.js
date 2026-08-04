import { isKnownFinancialType } from '@/mocks/models/categoryModel'
import {
  isKnownCategoryColor,
  isKnownCategoryIcon,
} from '@/mocks/data/categoryAppearanceData'
import { hasText } from '@/mocks/utils/text'

export function validateCategoryInput({
  name,
  type,
  color,
  icon,
  currentCategory,
}) {
  if (!hasText(name)) {
    throw new Error('O nome da categoria é obrigatório')
  }

  if (!isKnownFinancialType(type)) {
    throw new Error('Tipo de categoria inválido')
  }

  if (
    !isKnownCategoryColor(color) &&
    currentCategory?.color !== color
  ) {
    throw new Error('Selecione uma cor de categoria válida')
  }

  if (
    !isKnownCategoryIcon(icon) &&
    currentCategory?.icon !== icon
  ) {
    throw new Error('Selecione um ícone de categoria válido')
  }
}
