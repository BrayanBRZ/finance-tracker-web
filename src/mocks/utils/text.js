export function hasText(value) {
  return Boolean(value?.trim())
}

export function normalizeRequiredText(value) {
  return value.trim()
}

export function normalizeOptionalText(value) {
  return value?.trim() ?? ''
}

export function normalizeEmail(email) {
  return normalizeRequiredText(email).toLowerCase()
}

export function isSameNormalizedText(leftText, rightText) {
  return (
    normalizeRequiredText(leftText).toLowerCase() ===
    normalizeRequiredText(rightText).toLowerCase()
  )
}
