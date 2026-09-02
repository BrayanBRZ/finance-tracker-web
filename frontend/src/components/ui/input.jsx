import { cn } from '@/lib/utils'

function Input({ className, type, ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'border-input text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 disabled:bg-input/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 flex h-10 w-full min-w-0 rounded-(--radius) border bg-transparent px-3 py-2 text-base shadow-xs transition-colors outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-1 md:text-sm',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
