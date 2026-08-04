import { FieldGroup } from '@/components/ui/field'
import { cn } from '@/lib/utils'

function AuthVisualPanel() {
  return (
    <div className="bg-primary relative hidden flex-col items-center justify-center overflow-hidden md:flex">
      <div className="bg-primary-foreground/10 absolute z-0 h-125 w-125 rounded-full blur-[120px]" />
    </div>
  )
}

export function AuthScreenLayout({ children, visualSide = 'right' }) {
  const panel = <AuthVisualPanel />
  const content = (
    <div className="bg-background relative flex h-full w-full flex-col items-center justify-center p-5">
      {children}
    </div>
  )

  return (
    <section className="bg-background grid h-full md:grid-cols-2">
      {visualSide === 'left' ? panel : null}
      {content}
      {visualSide === 'right' ? panel : null}
    </section>
  )
}

export function AuthFormLayout({
  children,
  className,
  fieldGroupClassName,
  ...props
}) {
  return (
    <form noValidate className={cn('w-full max-w-77', className)} {...props}>
      <FieldGroup className={cn('gap-3 p-3', fieldGroupClassName)}>
        {children}
      </FieldGroup>
    </form>
  )
}

export function AuthFormHeader({ title, description, action, className }) {
  return (
    <header className={cn('mb-1 flex flex-col items-start gap-1.5', className)}>
      <h1 className="text-foreground text-3xl tracking-tight">{title}</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        {description} {action}
      </p>
    </header>
  )
}
