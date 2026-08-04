import { Link } from 'react-router-dom'
import { AuthFormHeader, AuthScreenLayout } from '@/components/auth/AuthLayout'
import { AuthForm } from '@/components/auth/form/AuthForm'
import { AuthFormError } from '@/components/auth/form/AuthFormError'
import { AuthFormSubmit } from '@/components/auth/form/AuthFormSubmit'
import { AuthPasswordField } from '@/components/auth/form/AuthPasswordField'
import { AuthPasswordStrengthIndicator } from '@/components/auth/form/AuthPasswordStrengthIndicator'
import { useResetPasswordController } from '@/hooks/useResetPasswordForm'

export function ResetPasswordForm() {
  const {
    form: {
      register,
      handleSubmit,
      watch,
      formState: { errors, isSubmitting },
    },
    onSubmit,
  } = useResetPasswordController()

  return (
    <AuthScreenLayout visualSide="left">
      <AuthForm onSubmit={handleSubmit(onSubmit)}>
        <AuthFormHeader
          title="Redefinir senha"
          description="Já tem acesso?"
          action={
            <Link
              to="/login"
              className="text-foreground font-medium underline-offset-4 hover:underline"
            >
              Voltar ao login
            </Link>
          }
        />
        <AuthPasswordField
          id="reset-password"
          label="Nova senha"
          autoComplete="new-password"
          {...register('newPassword')}
          disabled={isSubmitting}
          error={errors.newPassword?.message}
          labelAddon={
            <AuthPasswordStrengthIndicator password={watch('newPassword', '')} />
          }
        />
        <AuthPasswordField
          id="reset-password-confirmation"
          label="Confirmar nova senha"
          autoComplete="new-password"
          {...register('confirmPassword')}
          disabled={isSubmitting}
          error={errors.confirmPassword?.message}
        />
        <AuthFormSubmit
          buttonText="Redefinir senha"
          isSubmitting={isSubmitting}
          disabled={isSubmitting}
        />
        <AuthFormError
          id="reset-password-error"
          error={errors.root?.server?.message}
        />
      </AuthForm>
    </AuthScreenLayout>
  )
}
