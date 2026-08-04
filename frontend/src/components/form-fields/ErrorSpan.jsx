import { cn } from '@/lib/utils'

export function ErrorSpan({ error, className, ...props }) {
  return (
    <span
      role={error ? 'alert' : undefined}
      className={cn('text-destructive min-h-4 text-xs', className)}
      {...props}
    >
      {error}
    </span>
  )
}
