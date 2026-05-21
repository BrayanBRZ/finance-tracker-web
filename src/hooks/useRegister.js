import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { registerSchema } from '@/schemas/registerSchema'
import { registerUser } from '@/services/registerService'
import { AppError } from '@/utils/appError'

export function useRegister() {
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const form = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
  })

  const handleRegister = async (data) => {
    try {
      await registerUser(data)
      setSuccess(true)
      setTimeout(() => {
        navigate('/login', {
          state: { toast: 'Conta criada com sucesso! Faça login para continuar.' },
        })
      }, 400)
    } catch (error) {
      if (error instanceof AppError) {
        if (error.field) { // Para campos específicos
          form.setError(error.field, {
            type: 'server',
            message: error.message,
          });
        } else { // Sem campos específicos
          form.setError('root', {
            type: 'server',
            message: error.message,
          });
        }
      } else { // Exceções sem tratamento
        form.setError('root', {
          type: 'server',
          message: 'Ocorreu um erro inesperado no sistema. Tente novamente mais tarde.',
        });
      }
    }
  }

  return {
    form,
    success,
    handleRegister,
  }
}