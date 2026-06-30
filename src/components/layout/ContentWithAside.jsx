import { cn } from '@/lib/utils'

export function ContentWithAside({ children, className }) {
  return (
    <div className={cn('grid gap-6 lg:grid-cols-[1fr_22rem]', className)}>
      {children}
    </div>
  )
}
