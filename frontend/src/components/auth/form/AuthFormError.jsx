import { ErrorSpan } from '@/components/form-fields/ErrorSpan'

export function AuthFormError(props) {
  return <ErrorSpan className="min-h-4 text-center text-xs" {...props} />
}
