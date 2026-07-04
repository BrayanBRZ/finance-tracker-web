import { cn } from '@/lib/utils'

export function ErrorSpan({ error, className, ...props }) {
  return (
    <span
      role={error ? 'alert' : undefined}
      className={cn('min-h-4 text-xs text-destructive', className)}
      {...props}
    >
      {error}
    </span>
  )
}
