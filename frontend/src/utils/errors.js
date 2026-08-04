export const getErrorMessage = (
  error,
  fallback = 'Não foi possível concluir a operação.',
) => (error instanceof Error ? error.message : fallback)
