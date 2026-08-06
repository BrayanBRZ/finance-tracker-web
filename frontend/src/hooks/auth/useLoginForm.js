import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSession } from '@/context/sessionContext'
import { useToast } from '@/hooks/useToast'
import { loginSchema } from '@/schemas/loginSchema'
import { applyApiErrors } from '@/utils/formErrors'

export function useLoginForm() {
  const location = useLocation()
  const handledToastRef = useRef(null)
  const navigate = useNavigate()
  const { toast } = useToast()
  const { handleLogin } = useSession()
  const form = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: { email: '', password: '', rememberMe: false },
  })

  useEffect(() => {
    const message = location.state?.toast
    if (!message || handledToastRef.current === message) return

    handledToastRef.current = message
    toast({ message, variant: 'success' })
    navigate(location.pathname, { replace: true, state: null })
  }, [location.pathname, location.state?.toast, navigate, toast])

  const onSubmit = async (credentials) => {
    try {
      form.clearErrors('root')
      await handleLogin(credentials)
    } catch (error) {
      applyApiErrors(form, error)
    }
  }

  return { form, onSubmit }
}
