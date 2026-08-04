import { AuthFormHeader } from '@/components/auth/AuthLayout'
import { AuthForm } from '@/components/auth/form/AuthForm'
import { AuthFormError } from '@/components/auth/form/AuthFormError'
import { AuthFormSubmit } from '@/components/auth/form/AuthFormSubmit'
import { AuthPasswordField } from '@/components/auth/form/AuthPasswordField'
import { AuthPasswordStrengthIndicator } from '@/components/auth/form/AuthPasswordStrengthIndicator'
import { useChangePasswordForm } from '@/hooks/useChangePasswordForm'

export function ChangePasswordForm() {
  const { form, newPassword, onSubmit } = useChangePasswordForm()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

  return (
    <AuthForm onSubmit={handleSubmit(onSubmit)}>
      <AuthFormHeader
        title="Alterar senha"
        description="Confirme sua senha atual para definir uma nova."
      />
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
        labelAddon={
          <AuthPasswordStrengthIndicator password={newPassword ?? ''} />
        }
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
      <AuthFormError
        id="change-password-error"
        error={errors.root?.server?.message}
      />
    </AuthForm>
  )
}
