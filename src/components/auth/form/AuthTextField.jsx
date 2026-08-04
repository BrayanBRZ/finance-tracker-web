import { TextField } from '@/components/form-fields/TextField'

const authInputClassName = 'h-10 px-2.5 py-1.5 text-sm'

export function AuthTextField(props) {
  return <TextField inputClassName={authInputClassName} {...props} />
}
