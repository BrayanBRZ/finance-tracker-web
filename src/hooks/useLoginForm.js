import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '@/schemas/loginSchema'
import { login } from '@/services/authService'
import { useSession } from '@/context/sessionContext'

export function useLoginForm() {
  const { handleLogin } = useSession()
  const form = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  const onSubmit = async (credentials) => {
    try {
      form.clearErrors('root')
      const authSession = await login(credentials)
      handleLogin(authSession)
    } catch (error) {
      form.setError('root.server', {
        type: 'server',
        message:
          error instanceof Error
            ? error.message
            : 'Ocorreu um erro inesperado.',
      })
    }
  }

  return {
    form,
    onSubmit,
  }
}
