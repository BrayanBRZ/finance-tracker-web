import { cn } from '@/lib/utils'
import { PageLoader } from '@/components/feedback/PageLoader'

export function RouteLoader({ className }) {
  return (
    <PageLoader
      fullBleed={false}
      className={cn('min-h-screen', className)}
      label="Carregando sessão..."
    />
  )
}
