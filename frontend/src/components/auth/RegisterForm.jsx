import { Link } from 'react-router-dom'
import { AuthFormHeader, AuthScreenLayout } from '@/components/auth/AuthLayout'
import { AuthForm } from '@/components/auth/form/AuthForm'
import { AuthFormError } from '@/components/auth/form/AuthFormError'
import { AuthFormSubmit } from '@/components/auth/form/AuthFormSubmit'
import { AuthPasswordField } from '@/components/auth/form/AuthPasswordField'
import { AuthPasswordStrengthIndicator } from '@/components/auth/form/AuthPasswordStrengthIndicator'
import { AuthTextField } from '@/components/auth/form/AuthTextField'
import { useRegisterForm } from '@/hooks/useRegisterForm'

export function RegisterForm() {
  const {
    form: {
      register,
      handleSubmit,
      watch,
      formState: { errors, isSubmitting },
    },
    onSubmit,
  } = useRegisterForm()

  return (
    <AuthScreenLayout visualSide="left">
      <AuthForm onSubmit={handleSubmit(onSubmit)}>
        <AuthFormHeader
          title="Criar conta"
          description="Já tem uma conta?"
          action={
            <Link
              to="/login"
              className="text-foreground font-medium underline-offset-4 hover:underline"
            >
              Efetuar login
            </Link>
          }
        />

        <AuthTextField
          id="name"
          label="Nome completo"
          autoComplete="name"
          placeholder="Seu nome"
          {...register('name')}
          disabled={isSubmitting}
          error={errors.name?.message}
        />

        <AuthTextField
          id="register-email"
          label="E-mail"
          type="email"
          autoComplete="email"
          placeholder="nome@exemplo.com"
          {...register('email')}
          disabled={isSubmitting}
          error={errors.email?.message}
        />

        <AuthPasswordField
          id="register-password"
          label="Senha"
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
          {...register('password')}
          disabled={isSubmitting}
          error={errors.password?.message}
          labelAddon={
            <AuthPasswordStrengthIndicator password={watch('password', '')} />
          }
        />

        <AuthPasswordField
          id="confirm-password"
          label="Confirmar senha"
          autoComplete="new-password"
          placeholder="Repita a senha"
          {...register('confirmPassword')}
          disabled={isSubmitting}
          error={errors.confirmPassword?.message}
        />

        <AuthFormSubmit buttonText="Cadastrar-se" isSubmitting={isSubmitting} />
        <AuthFormError
          id="register-error"
          error={errors.root?.server?.message}
        />
      </AuthForm>
    </AuthScreenLayout>
  )
}
