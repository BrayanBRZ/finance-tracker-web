import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { authMock } from '@/services/authMock'

export function useRegister() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [authError, setAuthError] = useState('')
  const [success, setSuccess] = useState(false)

  const form = useForm({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  const { setError } = form

  const togglePassword = () => setShowPassword((prev) => !prev)
  const toggleConfirm = () => setShowConfirm((prev) => !prev)

  const handleRegister = async (data) => {
    setAuthError('')

    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', { message: 'As senhas não coincidem' })
      return
    }

    try {
      await authMock.register(data.name, data.email, data.password)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setAuthError(err.message)
    }
  }

  return {
    form,
    showPassword,
    showConfirm,
    togglePassword,
    toggleConfirm,
    authError,
    success,
    handleRegister,
  }
}