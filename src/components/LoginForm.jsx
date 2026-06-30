import { useState } from 'react'
import { Controller } from 'react-hook-form'
import { Link, useLocation } from 'react-router-dom'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/PasswordInput'
import { Checkbox } from '@/components/ui/checkbox'
import { useLoginForm } from '@/hooks/useLoginForm'
import { ErrorSpan } from '@/components/ErrorSpan'
import { FormSubmit } from '@/components/FormSubmit'
import { Toast } from '@/components/feedback/Toast'

export function LoginForm() {
  const location = useLocation()
  const [toastMessage, setToastMessage] = useState(
    () => location.state?.toast ?? null
  )

  const {
    form: {
      control,
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
    },
    onSubmit,
  } = useLoginForm()

  return (
    <>
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      <section className="grid h-full p-0 md:grid-cols-2">
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="relative flex h-full w-full flex-col items-center justify-center bg-white p-5"
        >
          <FieldGroup className="flex max-w-md flex-col gap-2 p-4">
            <header className="mt-2 mb-2 flex flex-col items-start gap-2">
              <h1 className="text-4xl tracking-tight text-zinc-950">
                Efetuar login
              </h1>
              <p className="mt-2 text-base text-zinc-500">
                Não possui uma conta?{' '}
                <Link
                  to="/cadastro"
                  className="cursor-pointer text-base text-zinc-950 hover:underline"
                >
                  Cadastre-se
                </Link>
              </p>
            </header>

            <div className="flex flex-col gap-2">
              <Field className="flex flex-col">
                <FieldLabel htmlFor="email" className="text-lg text-zinc-500">
                  E-mail
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="nome@exemplo.com"
                  {...register('email')}
                  disabled={isSubmitting}
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                <ErrorSpan id="email-error" error={errors.email?.message} />
              </Field>

              <Field className="flex flex-col">
                <FieldLabel
                  htmlFor="password"
                  className="text-lg text-zinc-500"
                >
                  Senha
                </FieldLabel>
                <PasswordInput
                  id="password"
                  autoComplete="current-password"
                  placeholder="Sua senha"
                  {...register('password')}
                  disabled={isSubmitting}
                  aria-invalid={errors.password ? true : undefined}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <ErrorSpan
                  id="password-error"
                  error={errors.password?.message}
                />
              </Field>
            </div>

            <div className="flex justify-between">
              <Field
                orientation="horizontal"
                className="flex max-w-40 items-center gap-2"
              >
                <Controller
                  name="rememberMe"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="rememberMe"
                      name={field.name}
                      ref={field.ref}
                      checked={field.value}
                      onBlur={field.onBlur}
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                      disabled={isSubmitting}
                      className="cursor-pointer border-zinc-400"
                    />
                  )}
                />
                <FieldLabel
                  htmlFor="rememberMe"
                  className="cursor-pointer text-sm text-zinc-950 hover:underline"
                >
                  Lembre-se de mim
                </FieldLabel>
              </Field>
              <Link
                to="/recuperar-senha"
                className="max-w-40 text-sm text-zinc-950 hover:underline"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <FormSubmit buttonText="Entrar" isSubmitting={isSubmitting} />
            <ErrorSpan
              id="login-error"
              error={errors.root?.server?.message}
              className="min-h-5 text-center text-sm"
            />
          </FieldGroup>
        </form>

        <div className="relative hidden flex-col items-center justify-center overflow-hidden bg-[#08205d] md:flex">
          <div className="absolute z-0 h-125 w-125 rounded-full bg-white/10 blur-[120px]" />
        </div>
      </section>
    </>
  )
}
