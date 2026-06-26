import { cn } from '@/lib/utils'

const ErrorSpan = ({ error, className, ...props }) => {
  return (
    <span
      role={error ? 'alert' : undefined}
      className={cn('min-h-4 text-xs text-red-500', className)}
      {...props}
    >
      {error}
    </span>
  )
}

export { ErrorSpan }
