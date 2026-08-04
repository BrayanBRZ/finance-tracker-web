import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { newPasswordSchema } from '@/schemas/newPasswordSchema'
import { resetPassword } from '@/services/authService'

export function useResetPasswordController() {
  const { token } = useParams()
  const navigate = useNavigate()
  const form = useForm({
    resolver: zodResolver(newPasswordSchema),
    mode: 'onTouched',
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async ({ newPassword }) => {
    if (!token) {
      return
    }

    try {
      form.clearErrors('root')

      const response = await resetPassword({
        token,
        newPassword,
      })

      navigate('/login', {
        replace: true,
        state: {
          toast: response.message,
        },
      })
    } catch (error) {
      form.setError('root.server', {
        type: 'server',
        message:
          error instanceof Error
            ? error.message
            : 'Não foi possível redefinir a senha.',
      })
    }
  }

  return {
    form,
    onSubmit,
  }
}
