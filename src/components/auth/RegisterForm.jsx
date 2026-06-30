import { Link } from 'react-router-dom'
import {
  AuthFormHeader,
  AuthScreenLayout,
} from '@/components/auth/AuthScreenLayout'
import { ErrorSpan } from '@/components/forms/ErrorSpan'
import { FormSubmit } from '@/components/forms/FormSubmit'
import { PasswordField } from '@/components/forms/PasswordField'
import { PasswordStrengthIndicator } from '@/components/forms/PasswordStrengthIndicator'
import { TextField } from '@/components/forms/TextField'
import { FieldGroup } from '@/components/ui/field'
import { useRegister } from '@/hooks/useRegister'

export function RegisterForm() {
  const {
    form: {
      register,
      handleSubmit,
      watch,
      formState: { errors, isSubmitting },
    },
    handleRegister,
  } = useRegister()

  return (
    <AuthScreenLayout visualSide="left">
      <form
        noValidate
        onSubmit={handleSubmit(handleRegister)}
        className="w-full max-w-md"
      >
        <FieldGroup className="gap-4 p-4">
          <AuthFormHeader
            title="Criar conta"
            description="Já tem uma conta?"
            action={
              <Link
                to="/login"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Efetuar login
              </Link>
            }
          />

          <TextField
            id="name"
            label="Nome completo"
            autoComplete="name"
            placeholder="Seu nome"
            {...register('name')}
            disabled={isSubmitting}
            error={errors.name?.message}
          />

          <TextField
            id="register-email"
            label="E-mail"
            type="email"
            autoComplete="email"
            placeholder="nome@exemplo.com"
            {...register('email')}
            disabled={isSubmitting}
            error={errors.email?.message}
          />

          <PasswordField
            id="register-password"
            label="Senha"
            autoComplete="new-password"
            placeholder="Mínimo 6 caracteres"
            {...register('password')}
            disabled={isSubmitting}
            error={errors.password?.message}
            labelAddon={
              <PasswordStrengthIndicator password={watch('password', '')} />
            }
          />

          <PasswordField
            id="confirm-password"
            label="Confirmar senha"
            autoComplete="new-password"
            placeholder="Repita a senha"
            {...register('confirmPassword')}
            disabled={isSubmitting}
            error={errors.confirmPassword?.message}
          />

          <ErrorSpan
            id="register-error"
            error={errors.root?.server?.message}
            className="min-h-5 text-center text-sm"
          />
          <FormSubmit buttonText="Cadastrar-se" isSubmitting={isSubmitting} />
        </FieldGroup>
      </form>
    </AuthScreenLayout>
  )
}
