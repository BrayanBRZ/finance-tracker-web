import { cn } from '@/lib/utils'

export function CollectionEmptyState({ children, className }) {
  return (
    <div
      className={cn(
        'rounded-(--radius) border border-dashed border-border bg-muted/40 p-5 text-sm text-muted-foreground',
        className,
      )}
    >
      {children}
    </div>
  )
}
