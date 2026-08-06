const isValidHexColor = (color) =>
  typeof color === 'string' && /^#[\da-f]{6}$/i.test(color)

export const getCategoryColor = (color) =>
  isValidHexColor(color) ? color : 'var(--muted-foreground)'

export const categoryAppearanceOptions = {
  colors: [
    { value: '#2563eb', label: 'Azul' },
    { value: '#16a34a', label: 'Verde' },
    { value: '#f97316', label: 'Laranja' },
    { value: '#dc2626', label: 'Vermelho' },
    { value: '#9333ea', label: 'Roxo' },
    { value: '#db2777', label: 'Rosa' },
    { value: '#0891b2', label: 'Ciano' },
    { value: '#ca8a04', label: 'Amarelo' },
  ],
  icons: [
    { value: 'wallet', label: 'Carteira' },
    { value: 'utensils', label: 'Alimentação' },
    { value: 'car', label: 'Transporte' },
    { value: 'house', label: 'Moradia' },
    { value: 'heart-pulse', label: 'Saúde' },
    { value: 'graduation-cap', label: 'Educação' },
    { value: 'gamepad-2', label: 'Lazer' },
    { value: 'receipt-text', label: 'Assinaturas e contas' },
    { value: 'briefcase-business', label: 'Trabalho' },
    { value: 'chart-no-axes-combined', label: 'Investimentos' },
    { value: 'gift', label: 'Presentes e bônus' },
    { value: 'shopping-bag', label: 'Compras' },
  ],
}
