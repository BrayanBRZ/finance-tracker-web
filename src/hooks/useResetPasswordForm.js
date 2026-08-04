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

  const onSubmit = async (newPassword) => {
    if (!token) {
      return
    }

    try {
      form.clearErrors('root')

      await resetPassword({
        token,
        newPassword,
      })

      navigate('/login', {
        replace: true,
        state: {
          toast: 'Senha redefinida com sucesso. Faça login para continuar.',
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
