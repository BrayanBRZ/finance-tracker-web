const padDatePart = (value) => String(value).padStart(2, '0')

export function toDateInputValue(date = new Date()) {
  const year = date.getFullYear()
  const month = padDatePart(date.getMonth() + 1)
  const day = padDatePart(date.getDate())

  return `${year}-${month}-${day}`
}
