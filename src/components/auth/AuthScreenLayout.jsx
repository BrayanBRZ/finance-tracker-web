import { cn } from '@/lib/utils'

function AuthVisualPanel() {
  return (
    <div className="relative hidden flex-col items-center justify-center overflow-hidden bg-primary md:flex">
      <div className="absolute z-0 h-125 w-125 rounded-full bg-primary-foreground/10 blur-[120px]" />
    </div>
  )
}

export function AuthScreenLayout({ children, visualSide = 'right' }) {
  const panel = <AuthVisualPanel />
  const content = (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-background p-5">
      {children}
    </div>
  )

  return (
    <section className="grid h-full bg-background md:grid-cols-2">
      {visualSide === 'left' ? panel : null}
      {content}
      {visualSide === 'right' ? panel : null}
    </section>
  )
}

export function AuthFormHeader({
  title,
  description,
  action,
  className,
}) {
  return (
    <header
      className={cn('mb-1 flex flex-col items-start gap-1.5', className)}
    >
      <h1 className="text-3xl tracking-tight text-foreground">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {description} {action}
      </p>
    </header>
  )
}
