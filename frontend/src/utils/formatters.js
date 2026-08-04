export { toDateInputValue } from '@/utils/dates'

const localDateFormatter = new Intl.DateTimeFormat('pt-BR')

export function formatCurrency(value) {
  return Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function formatLocalDate(value) {
  if (!value) return ''

  const [year, month, day] = String(value).split('-').map(Number)

  return localDateFormatter.format(new Date(year, month - 1, day))
}
