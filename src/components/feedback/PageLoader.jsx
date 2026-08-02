import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PageLoader({ className, label = 'Carregando conteúdo...' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex min-h-[calc(100vh-10rem)] w-full items-center justify-center',
        className,
      )}
    >
      <Loader2 className="size-10 animate-spin text-primary" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </div>
  )
}
