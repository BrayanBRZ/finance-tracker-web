import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function RouteLoader({ className }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn('flex min-h-screen w-full items-center justify-center', className)}
    >
      <Loader2 className="animate-spin text-[#08205d]" size={40} />
      <span className="sr-only">Carregando sessão...</span>
    </div>
  )
}
