export function toIsoString(date) {
  return date.toISOString()
}

export function createIsoTimestamp() {
  return toIsoString(new Date())
}
