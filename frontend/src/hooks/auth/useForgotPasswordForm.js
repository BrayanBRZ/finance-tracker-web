import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotPasswordSchema } from '@/schemas/forgotPasswordSchema'
import { requestPasswordReset } from '@/services/authService'
import { useToast } from '@/hooks/useToast'
import { applyApiErrors } from '@/utils/formErrors'

export function useForgotPasswordForm() {
  const { toast } = useToast()
  const form = useForm({ resolver: zodResolver(forgotPasswordSchema), mode: 'onTouched', defaultValues: { email: '' } })

  const onSubmit = async (data) => {
    try {
      form.clearErrors('root')
      const response = await requestPasswordReset(data)
      toast({ message: response.message, variant: 'success' })
    } catch (error) {
      applyApiErrors(form, error)
    }
  }

  return { form, onSubmit }
}
