import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function RouteLoader({ className }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex min-h-screen w-full items-center justify-center',
        className,
      )}
    >
      <Loader2 className="text-primary animate-spin" size={40} />
      <span className="sr-only">Carregando sessão...</span>
    </div>
  )
}
