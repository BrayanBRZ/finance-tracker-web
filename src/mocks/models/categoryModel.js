import { createMockId } from '@/mocks/utils/createMockId'
import {
  FINANCIAL_TYPES,
  isKnownFinancialType,
} from '@/domain/financialTypes'
import { createIsoTimestamp } from '@/mocks/utils/date'
import {
  normalizeOptionalText,
  normalizeRequiredText,
} from '@/mocks/utils/text'
export { FINANCIAL_TYPES, isKnownFinancialType }

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
