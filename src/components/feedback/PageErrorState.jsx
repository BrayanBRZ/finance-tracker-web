import { StateCard } from '@/components/feedback/StateCard'

export function PageErrorState({
  eyebrow,
  description,
  onRetry,
  title = 'Algo saiu do trilho',
  retryLabel = 'Tentar novamente',
}) {
  return (
    <StateCard
      eyebrow={eyebrow}
      title={title}
      description={description}
      role="alert"
      action={
        onRetry
          ? {
              label: retryLabel,
              onClick: onRetry,
            }
          : undefined
      }
    />
  )
}
