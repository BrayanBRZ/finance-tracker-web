import { Link } from 'react-router-dom'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/PasswordInput'
import { useRegister } from '@/hooks/useRegister'
import { PasswordStrengthIndicator } from '@/components/PasswordStrengthIndicator'
import { ErrorSpan } from '@/components/ErrorSpan'
import { FormSubmit } from '@/components/FormSubmit'

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
    <section className="grid h-full p-0 md:grid-cols-2">
      <div className="relative hidden flex-col items-center justify-center overflow-hidden bg-[#08205d] md:flex">
        <div className="absolute z-0 h-125 w-125 rounded-full bg-white/10 blur-[120px]" />
      </div>

      <form
        noValidate
        onSubmit={handleSubmit(handleRegister)}
        className="relative flex h-full w-full flex-col items-center justify-center bg-white p-5"
      >
        <FieldGroup className="flex w-full max-w-md flex-col gap-2 p-4">
          <header className="mt-2 mb-2 flex flex-col items-start gap-2">
            <h1 className="text-4xl tracking-tight text-zinc-950">
              Criar conta
            </h1>
            <p className="mt-2 text-base text-zinc-500">
              Já tem uma conta?{' '}
              <Link
                to="/login"
                className="font-medium text-zinc-950 hover:underline"
              >
                Efetuar login
              </Link>
            </p>
          </header>

          <div className="flex flex-col gap-2">
            <Field className="flex flex-col">
              <FieldLabel
                htmlFor="name"
                className="text-lg font-medium text-zinc-500"
              >
                Nome completo
              </FieldLabel>
              <Input
                id="name"
                autoComplete="name"
                placeholder="Seu nome"
                {...register('name')}
                disabled={isSubmitting}
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              <ErrorSpan id="name-error" error={errors.name?.message} />
            </Field>

            <Field className="flex flex-col">
              <FieldLabel
                htmlFor="register-email"
                className="text-lg font-medium text-zinc-500"
              >
                E-mail
              </FieldLabel>
              <Input
                id="register-email"
                type="email"
                autoComplete="email"
                placeholder="nome@exemplo.com"
                {...register('email')}
                disabled={isSubmitting}
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? 'register-email-error' : undefined}
              />
              <ErrorSpan
                id="register-email-error"
                error={errors.email?.message}
              />
            </Field>

            <Field className="flex flex-col">
              <div className="flex justify-between">
                <FieldLabel
                  htmlFor="register-password"
                  className="text-lg font-medium text-zinc-500"
                >
                  Senha
                </FieldLabel>
                <PasswordStrengthIndicator password={watch('password', '')} />
              </div>
              <PasswordInput
                id="register-password"
                autoComplete="new-password"
                placeholder="Mínimo 6 caracteres"
                {...register('password')}
                disabled={isSubmitting}
                aria-invalid={errors.password ? true : undefined}
                aria-describedby={
                  errors.password ? 'register-password-error' : undefined
                }
              />
              <ErrorSpan
                id="register-password-error"
                error={errors.password?.message}
              />
            </Field>

            <Field className="flex flex-col">
              <FieldLabel
                htmlFor="confirm-password"
                className="text-lg font-medium text-zinc-500"
              >
                Confirmar senha
              </FieldLabel>
              <PasswordInput
                id="confirm-password"
                autoComplete="new-password"
                placeholder="Repita a senha"
                {...register('confirmPassword')}
                disabled={isSubmitting}
                aria-invalid={errors.confirmPassword ? true : undefined}
                aria-describedby={
                  errors.confirmPassword ? 'confirm-password-error' : undefined
                }
              />
              <ErrorSpan
                id="confirm-password-error"
                error={errors.confirmPassword?.message}
              />
            </Field>
          </div>

          <ErrorSpan
            id="register-error"
            error={errors.root?.server?.message}
            className="min-h-5 text-center text-sm"
          />
          <FormSubmit buttonText="Cadastrar-se" isSubmitting={isSubmitting} />
        </FieldGroup>
      </form>
    </section>
  )
}
