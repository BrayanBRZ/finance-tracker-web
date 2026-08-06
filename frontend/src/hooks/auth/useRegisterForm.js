import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { registerSchema } from '@/schemas/registerSchema'
import { registerUser } from '@/services/authService'
import { applyApiErrors } from '@/utils/formErrors'

export function useRegisterForm() {
  const navigate = useNavigate()
  const form = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  const onSubmit = async ({ name, email, password }) => {
    try {
      form.clearErrors('root')
      await registerUser({ name, email, password })
      navigate('/login', { state: { toast: 'Conta criada com sucesso! Faça login para continuar.' } })
    } catch (error) {
      applyApiErrors(form, error)
    }
  }

  return { form, onSubmit }
}
