const padDatePart = (value) => String(value).padStart(2, '0')

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

export function toDateInputValue(date = new Date()) {
  const year = date.getFullYear()
  const month = padDatePart(date.getMonth() + 1)
  const day = padDatePart(date.getDate())

  return `${year}-${month}-${day}`
}
