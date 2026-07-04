import { FieldGroup } from '@/components/ui/field'

export function AuthForm({ children, ...props }) {
  return (
    <form noValidate className="w-full max-w-[19.25rem]" {...props}>
      <FieldGroup className="gap-3 p-3">{children}</FieldGroup>
    </form>
  )
}
