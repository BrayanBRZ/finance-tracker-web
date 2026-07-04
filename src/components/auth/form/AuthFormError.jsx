import { ErrorSpan } from '@/components/forms/ErrorSpan'

export function AuthFormError(props) {
  return (
    <ErrorSpan
      className="min-h-4 text-center text-xs"
      {...props}
    />
  )
}
