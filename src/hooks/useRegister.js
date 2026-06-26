import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { registerSchema } from '@/schemas/registerSchema'
import { registerUser } from '@/services/authService'

export function useRegister() {
  const navigate = useNavigate()

  const form = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const handleRegister = async (data) => {
    try {
      form.clearErrors('root')
      await registerUser(data)
      navigate('/login', {
        state: {
          toast: 'Conta criada com sucesso! Faça login para continuar.',
        },
      })
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
    handleRegister,
  }
}
