import { cn } from '@/lib/utils'

export function ContentWithAside({ children, className }) {
  return (
    <div
      className={cn(
        'grid min-h-0 flex-1 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]',
        className,
      )}
    >
      {children}
    </div>
  )
}
