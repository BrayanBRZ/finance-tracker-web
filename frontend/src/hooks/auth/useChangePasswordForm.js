import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { changePassword } from '@/services/userService'
import { changePasswordSchema } from '@/schemas/changePasswordSchema'
import { applyApiErrors } from '@/utils/formErrors'
import { useToast } from '@/hooks/useToast'

export function useChangePasswordForm() {
  const { toast } = useToast()
  const form = useForm({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onTouched',
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })
  const newPassword = useWatch({ control: form.control, name: 'newPassword' })

  const onSubmit = async ({ currentPassword, newPassword }) => {
    try {
      form.clearErrors('root')
      const response = await changePassword({ currentPassword, newPassword })
      form.reset()
      toast({ message: response.message, variant: 'success' })
    } catch (error) {
      applyApiErrors(form, error)
    }
  }

  return { form, newPassword, onSubmit }
}
