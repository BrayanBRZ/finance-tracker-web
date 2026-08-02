import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AuthFormHeader,
  AuthScreenLayout,
} from '@/components/auth/AuthScreenLayout'
import { AuthForm } from '@/components/auth/form/AuthForm'
import { AuthFormError } from '@/components/auth/form/AuthFormError'
import { AuthFormSubmit } from '@/components/auth/form/AuthFormSubmit'
import { AuthTextField } from '@/components/auth/form/AuthTextField'
import { forgotPasswordSchema } from '@/schemas/forgotPasswordSchema'
import { requestPasswordReset } from '@/services/authService'

export function ForgotPasswordForm() {
  const [message, setMessage] = useState(null)
  const [debugToken, setDebugToken] = useState(null)
  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onTouched',
    defaultValues: { email: '' },
  })
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

  const submit = async (data) => {
    try {
      form.clearErrors('root')
      const response = await requestPasswordReset(data)
      setMessage(response.message)
      setDebugToken(response.debugToken)
    } catch (error) {
      form.setError('root.server', {
        type: 'server',
        message: error instanceof Error ? error.message : 'Não foi possível solicitar a recuperação.',
      })
    }
  }

  return (
    <AuthScreenLayout visualSide="right">
      <AuthForm onSubmit={handleSubmit(submit)}>
        <AuthFormHeader
          title="Recuperar senha"
          description="Recordou sua senha?"
          action={<Link to="/login" className="font-medium text-foreground underline-offset-4 hover:underline">Voltar ao login</Link>}
        />
        <AuthTextField
          id="forgot-password-email"
          label="E-mail"
          type="email"
          autoComplete="email"
          placeholder="nome@exemplo.com"
          {...register('email')}
          disabled={isSubmitting}
          error={errors.email?.message}
        />
        <AuthFormSubmit buttonText="Enviar instruções" isSubmitting={isSubmitting} />
        <AuthFormError id="forgot-password-error" error={errors.root?.server?.message} />
        {message ? <p role="status" className="text-sm text-muted-foreground">{message}</p> : null}
        {debugToken ? (
          <Link
            to={`/redefinir-senha/${debugToken}`}
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Abrir redefinição no ambiente de testes
          </Link>
        ) : null}
      </AuthForm>
    </AuthScreenLayout>
  )
}
