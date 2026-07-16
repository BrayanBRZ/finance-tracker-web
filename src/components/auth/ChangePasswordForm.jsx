import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthForm } from '@/components/auth/form/AuthForm'
import { AuthFormError } from '@/components/auth/form/AuthFormError'
import { AuthFormSubmit } from '@/components/auth/form/AuthFormSubmit'
import { AuthPasswordField } from '@/components/auth/form/AuthPasswordField'
import { AuthPasswordStrengthIndicator } from '@/components/auth/form/AuthPasswordStrengthIndicator'
import { changePasswordSchema } from '@/schemas/changePasswordSchema'
import { changePassword } from '@/services/authService'
import { useSession } from '@/context/sessionContext'

export function ChangePasswordForm() {
  const { session } = useSession()
  const [successMessage, setSuccessMessage] = useState(null)
  const form = useForm({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onTouched',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = form

  const submit = async ({ currentPassword, newPassword }) => {
    try {
      form.clearErrors('root')
      const response = await changePassword({
        userId: session?.user.id,
        currentPassword,
        newPassword,
      })
      reset()
      setSuccessMessage(response.message)
    } catch (error) {
      setSuccessMessage(null)
      form.setError('root.server', {
        type: 'server',
        message: error instanceof Error ? error.message : 'Não foi possível alterar a senha.',
      })
    }
  }

  return (
    <AuthForm onSubmit={handleSubmit(submit)}>
      <AuthPasswordField
        id="current-password"
        label="Senha atual"
        autoComplete="current-password"
        {...register('currentPassword')}
        disabled={isSubmitting}
        error={errors.currentPassword?.message}
      />
      <AuthPasswordField
        id="new-password"
        label="Nova senha"
        autoComplete="new-password"
        {...register('newPassword')}
        disabled={isSubmitting}
        error={errors.newPassword?.message}
        labelAddon={<AuthPasswordStrengthIndicator password={watch('newPassword', '')} />}
      />
      <AuthPasswordField
        id="new-password-confirmation"
        label="Confirmar nova senha"
        autoComplete="new-password"
        {...register('confirmPassword')}
        disabled={isSubmitting}
        error={errors.confirmPassword?.message}
      />
      <AuthFormSubmit buttonText="Alterar senha" isSubmitting={isSubmitting} />
      <AuthFormError id="change-password-error" error={errors.root?.server?.message} />
      {successMessage ? <p role="status" className="text-sm text-primary">{successMessage}</p> : null}
    </AuthForm>
  )
}
