import { useState } from 'react'
import { Controller } from 'react-hook-form'
import { Link, useLocation } from 'react-router-dom'
import {
  AuthFormHeader,
  AuthScreenLayout,
} from '@/components/auth/AuthScreenLayout'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { ErrorSpan } from '@/components/forms/ErrorSpan'
import { FormSubmit } from '@/components/forms/FormSubmit'
import { PasswordField } from '@/components/forms/PasswordField'
import { TextField } from '@/components/forms/TextField'
import { Toast } from '@/components/feedback/Toast'
import { useLoginForm } from '@/hooks/useLoginForm'

export function LoginForm() {
  const location = useLocation()
  const [toastMessage, setToastMessage] = useState(
    () => location.state?.toast ?? null,
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
      {toastMessage ? (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      ) : null}

      <AuthScreenLayout visualSide="right">
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md"
        >
          <FieldGroup className="gap-4 p-4">
            <AuthFormHeader
              title="Efetuar login"
              description="Não possui uma conta?"
              action={
                <Link
                  to="/cadastro"
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  Cadastre-se
                </Link>
              }
            />

            <TextField
              id="email"
              label="E-mail"
              type="email"
              autoComplete="email"
              placeholder="nome@exemplo.com"
              {...register('email')}
              disabled={isSubmitting}
              error={errors.email?.message}
            />

            <PasswordField
              id="password"
              label="Senha"
              autoComplete="current-password"
              placeholder="Sua senha"
              {...register('password')}
              disabled={isSubmitting}
              error={errors.password?.message}
            />

            <div className="flex justify-between gap-4">
              <Field
                orientation="horizontal"
                className="flex max-w-44 items-center gap-2"
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
                      className="cursor-pointer"
                    />
                  )}
                />
                <FieldLabel
                  htmlFor="rememberMe"
                  className="cursor-pointer text-sm text-foreground hover:underline"
                >
                  Lembre-se de mim
                </FieldLabel>
              </Field>

              <Link
                to="/recuperar-senha"
                className="max-w-40 text-sm text-foreground underline-offset-4 hover:underline"
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
      </AuthScreenLayout>
    </>
  )
}
