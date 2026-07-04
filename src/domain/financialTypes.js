export const FINANCIAL_TYPES = Object.freeze({
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE',
})

export const FINANCIAL_TYPE_LABELS = Object.freeze({
  [FINANCIAL_TYPES.INCOME]: 'Receita',
  [FINANCIAL_TYPES.EXPENSE]: 'Despesa',
})

export const FINANCIAL_TYPE_OPTIONS = Object.freeze([
  {
    value: FINANCIAL_TYPES.EXPENSE,
    label: FINANCIAL_TYPE_LABELS[FINANCIAL_TYPES.EXPENSE],
  },
  {
    value: FINANCIAL_TYPES.INCOME,
    label: FINANCIAL_TYPE_LABELS[FINANCIAL_TYPES.INCOME],
  },
])

export function isKnownFinancialType(type) {
  return Object.values(FINANCIAL_TYPES).includes(type)
}
