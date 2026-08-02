const isValidHexColor = (color) =>
  typeof color === 'string' && /^#[\da-f]{6}$/i.test(color)

export const getCategoryColor = (color) =>
  isValidHexColor(color) ? color : 'var(--muted-foreground)'
