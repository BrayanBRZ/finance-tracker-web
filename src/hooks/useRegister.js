import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { registerSchema } from '@/schemas/registerSchema'
import { registerUser } from '@/services/registerService'

export function useRegister() {
  const [authError, setAuthError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const form = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
  })

  const password = form.watch('password', '')

  const handleRegister = async (data) => {
    setAuthError('')
    try {
      await registerUser(data)
      setSuccess(true)
      setTimeout(() => {
        navigate('/login', {
          state: { toast: 'Conta criada com sucesso! Faça login para continuar.' },
        })
      }, 400)
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : 'Ocorreu um erro inesperado.'
      )
    }
  }

  return {
    form,
    authError,
    success,
    handleRegister,
  }
}