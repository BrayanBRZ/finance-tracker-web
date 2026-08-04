import { Link } from 'react-router-dom'
import { AuthFormHeader, AuthScreenLayout } from '@/components/auth/AuthLayout'
import { AuthForm } from '@/components/auth/form/AuthForm'
import { AuthFormError } from '@/components/auth/form/AuthFormError'
import { AuthFormSubmit } from '@/components/auth/form/AuthFormSubmit'
import { AuthTextField } from '@/components/auth/form/AuthTextField'
import { useForgotPasswordForm } from '@/hooks/useForgotPasswordForm'

export function ForgotPasswordForm() {
  const { form, onSubmit } = useForgotPasswordForm()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

  return (
    <AuthScreenLayout visualSide="right">
      <AuthForm onSubmit={handleSubmit(onSubmit)}>
        <AuthFormHeader
          title="Recuperar senha"
          description="Recordou sua senha?"
          action={
            <Link
              to="/login"
              className="text-foreground font-medium underline-offset-4 hover:underline"
            >
              Voltar ao login
            </Link>
          }
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
        <AuthFormSubmit
          buttonText="Solicitar Redefinição"
          isSubmitting={isSubmitting}
        />
        <AuthFormError
          id="forgot-password-error"
          error={errors.root?.server?.message}
        />
      </AuthForm>
    </AuthScreenLayout>
  )
}
