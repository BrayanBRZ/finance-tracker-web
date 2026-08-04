import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotPasswordSchema } from '@/schemas/forgotPasswordSchema'
import { requestPasswordReset } from '@/services/authService'
import { useToast } from '@/hooks/useToast'
import { getErrorMessage } from '@/utils/errors'

export function useForgotPasswordForm() {
  const { toast } = useToast()
  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onTouched',
    defaultValues: { email: '' },
  })

  const onSubmit = async (data) => {
    try {
      form.clearErrors('root')
      await requestPasswordReset(data)
      toast({
        message:
          'Se este e-mail estiver cadastrado, você receberá as instruções em breve.',
        variant: 'success',
      })
    } catch (error) {
      form.setError('root.server', {
        type: 'server',
        message: getErrorMessage(
          error,
          'Não foi possível solicitar a recuperação.',
        ),
      })
    }
  }

  return { form, onSubmit }
}
