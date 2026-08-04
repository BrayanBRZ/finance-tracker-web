import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '@/schemas/loginSchema'
import { login } from '@/services/authService'
import { useSession } from '@/context/sessionContext'
import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/useToast'

export function useLoginForm() {
  const location = useLocation()
  const handledToastRef = useRef(null)
  const navigate = useNavigate()
  const { toast } = useToast()
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

  useEffect(() => {
    const message = location.state?.toast

    if (!message || handledToastRef.current === message) return

    handledToastRef.current = message

    toast({ message, variant: 'success' })
    navigate(location.pathname, {
      replace: true,
      state: null,
    })
  }, [location.pathname, location.state?.toast, navigate, toast])

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
