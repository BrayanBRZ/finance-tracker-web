import { createMockId } from '@/mocks/utils/createMockId'
import { createIsoTimestamp } from '@/mocks/utils/date'
import {
  normalizeOptionalText,
  normalizeRequiredText,
} from '@/mocks/utils/text'

export const FINANCIAL_TYPES = Object.freeze({
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
})

export function isKnownFinancialType(type) {
  return Object.values(FINANCIAL_TYPES).includes(type)
}

export function createCategory({
  walletId,
  name,
  type,
  color = '',
  icon = '',
}) {
  return {
    id: createMockId(),
    walletId,
    name: normalizeRequiredText(name),
    type,
    color: normalizeOptionalText(color),
    icon: normalizeOptionalText(icon),
    createdAt: createIsoTimestamp(),
  }
}

export function toPublicCategory(category) {
  return {
    id: category.id,
    walletId: category.walletId,
    name: category.name,
    type: category.type,
    color: category.color,
    icon: category.icon,
    createdAt: category.createdAt,
  }
}
