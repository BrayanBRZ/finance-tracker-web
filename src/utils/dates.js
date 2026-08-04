const dateInputPattern = /^\d{4}-\d{2}-\d{2}$/

const padDatePart = (value) => String(value).padStart(2, '0')

export function toDateInputValue(date = new Date()) {
  const year = date.getFullYear()
  const month = padDatePart(date.getMonth() + 1)
  const day = padDatePart(date.getDate())

  return `${year}-${month}-${day}`
}

export function parseDateInputValue(value) {
  if (!dateInputPattern.test(value)) return null

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  return toDateInputValue(date) === value ? date : null
}

export function isValidDateInputValue(value) {
  return Boolean(parseDateInputValue(value))
}

export function isFutureDateInputValue(value, today = new Date()) {
  return isValidDateInputValue(value) && value > toDateInputValue(today)
}
