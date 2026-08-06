import { Link } from 'react-router-dom'
import { Controller } from 'react-hook-form'
import { AuthFormHeader, AuthScreenLayout } from '@/components/auth/AuthLayout'
import { AuthForm } from '@/components/auth/form/AuthForm'
import { AuthFormError } from '@/components/auth/form/AuthFormError'
import { AuthFormSubmit } from '@/components/auth/form/AuthFormSubmit'
import { AuthPasswordField } from '@/components/auth/form/AuthPasswordField'
import { AuthTextField } from '@/components/auth/form/AuthTextField'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldLabel } from '@/components/ui/field'
import { useLoginForm } from '@/hooks/auth/useLoginForm'

export function LoginForm() {
  const {
    form: {
      register,
      control,
      handleSubmit,
      formState: { errors, isSubmitting },
    },
    onSubmit,
  } = useLoginForm()

  return (
    <AuthScreenLayout visualSide="right">
      <AuthForm onSubmit={handleSubmit(onSubmit)}>
        <AuthFormHeader
          title="Efetuar login"
          description="Não possui uma conta?"
          action={
            <Link
              to="/cadastro"
              className="text-foreground font-medium underline-offset-4 hover:underline"
            >
              Cadastre-se
            </Link>
          }
        />

        <AuthTextField
          id="email"
          label="E-mail"
          type="email"
          autoComplete="email"
          placeholder="nome@exemplo.com"
          {...register('email')}
          disabled={isSubmitting}
          error={errors.email?.message}
        />

        <AuthPasswordField
          id="password"
          label="Senha"
          autoComplete="current-password"
          placeholder="Sua senha"
          {...register('password')}
          disabled={isSubmitting}
          error={errors.password?.message}
        />

        <div className="flex gap-3">
          <Field
            orientation="horizontal"
            className="flex max-w-40 items-center gap-1.5"
          >
            <Controller
              name="rememberMe"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="rememberMe"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting}
                  className="size-3.5 cursor-pointer"
                />
              )}
            />
            <FieldLabel
              htmlFor="rememberMe"
              className="text-foreground cursor-pointer text-xs hover:underline"
            >
              Lembre-se de mim
            </FieldLabel>
          </Field>
          <Link
            to="/recuperar-senha"
            className="text-foreground ml-auto text-xs font-medium underline-offset-4 hover:underline"
          >
            Recuperar senha
          </Link>
        </div>

        <AuthFormSubmit buttonText="Entrar" isSubmitting={isSubmitting} />
        <AuthFormError id="login-error" error={errors.root?.server?.message} />
      </AuthForm>
    </AuthScreenLayout>
  )
}
