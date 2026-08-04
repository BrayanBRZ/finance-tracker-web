import { createMockId } from '@/mocks/utils/createMockId'
import { FINANCIAL_TYPES, isKnownFinancialType } from '@/domain/financialTypes'
import { createIsoTimestamp } from '@/mocks/utils/date'
import {
  normalizeOptionalText,
  normalizeRequiredText,
} from '@/mocks/utils/text'

export { FINANCIAL_TYPES, isKnownFinancialType }

export function createCategory({
  userId,
  name,
  type,
  color = '',
  icon = '',
}) {
  return {
    id: createMockId(),
    userId,
    name: normalizeRequiredText(name),
    type,
    color: normalizeOptionalText(color),
    icon: normalizeOptionalText(icon),
    createdAt: createIsoTimestamp(),
  }
}

export function updateCategory({ category, name, type, color = '', icon = '' }) {
  return {
    ...category,
    name: normalizeRequiredText(name),
    type,
    color: normalizeOptionalText(color),
    icon: normalizeOptionalText(icon),
  }
}

export function toPublicCategory(category) {
  return {
    id: category.id,
    userId: category.userId,
    name: category.name,
    type: category.type,
    color: category.color,
    icon: category.icon,
    createdAt: category.createdAt,
  }
}
