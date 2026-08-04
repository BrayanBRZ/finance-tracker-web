import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AuthFormHeader,
  AuthScreenLayout,
} from '@/components/auth/AuthLayout'
import { AuthForm } from '@/components/auth/form/AuthForm'
import { AuthFormError } from '@/components/auth/form/AuthFormError'
import { AuthFormSubmit } from '@/components/auth/form/AuthFormSubmit'
import { AuthPasswordField } from '@/components/auth/form/AuthPasswordField'
import { AuthPasswordStrengthIndicator } from '@/components/auth/form/AuthPasswordStrengthIndicator'
import { newPasswordSchema } from '@/schemas/newPasswordSchema'
import { resetPassword } from '@/services/authService'

export function ResetPasswordForm() {
  const { token } = useParams()
  const navigate = useNavigate()
  const form = useForm({
    resolver: zodResolver(newPasswordSchema),
    mode: 'onTouched',
    defaultValues: { newPassword: '', confirmPassword: '' },
  })
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = form
  const newPassword = useWatch({ control, name: 'newPassword' })

  const submit = async ({ newPassword }) => {
    if (!token) {
      form.setError('root.server', { type: 'server', message: 'Token de redefinição ausente.' })
      return
    }

    try {
      form.clearErrors('root')
      await resetPassword({ token, newPassword })
      navigate('/login', { state: { toast: 'Senha redefinida com sucesso. Faça login para continuar.' } })
    } catch (error) {
      form.setError('root.server', {
        type: 'server',
        message: error instanceof Error ? error.message : 'Não foi possível redefinir a senha.',
      })
    }
  }

  return (
    <AuthScreenLayout visualSide="left">
      <AuthForm onSubmit={handleSubmit(submit)}>
        <AuthFormHeader
          title="Redefinir senha"
          description="Já tem acesso?"
          action={<Link to="/login" className="font-medium text-foreground underline-offset-4 hover:underline">Voltar ao login</Link>}
        />
        <AuthPasswordField
          id="reset-password"
          label="Nova senha"
          autoComplete="new-password"
          {...register('newPassword')}
          disabled={isSubmitting}
          error={errors.newPassword?.message}
          labelAddon={<AuthPasswordStrengthIndicator password={newPassword ?? ''} />}
        />
        <AuthPasswordField
          id="reset-password-confirmation"
          label="Confirmar nova senha"
          autoComplete="new-password"
          {...register('confirmPassword')}
          disabled={isSubmitting}
          error={errors.confirmPassword?.message}
        />
        <AuthFormSubmit buttonText="Redefinir senha" isSubmitting={isSubmitting} />
        <AuthFormError id="reset-password-error" error={errors.root?.server?.message} />
      </AuthForm>
    </AuthScreenLayout>
  )
}
