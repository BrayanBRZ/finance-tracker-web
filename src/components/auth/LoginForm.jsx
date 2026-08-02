import { useState } from 'react'
import { Controller } from 'react-hook-form'
import { Link, useLocation } from 'react-router-dom'
import {
  AuthFormHeader,
  AuthScreenLayout,
} from '@/components/auth/AuthScreenLayout'

import { AuthForm } from '@/components/auth/form/AuthForm'
import { AuthFormError } from '@/components/auth/form/AuthFormError'
import { AuthFormSubmit } from '@/components/auth/form/AuthFormSubmit'
import { AuthPasswordField } from '@/components/auth/form/AuthPasswordField'
import { AuthTextField } from '@/components/auth/form/AuthTextField'

import { Toast } from '@/components/feedback/Toast'

import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldLabel } from '@/components/ui/field'

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
        <AuthForm onSubmit={handleSubmit(onSubmit)}>
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
                    name={field.name}
                    ref={field.ref}
                    checked={field.value}
                    onBlur={field.onBlur}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                    disabled={isSubmitting}
                    className="size-3.5 cursor-pointer"
                  />
                )}
              />
              <FieldLabel
                htmlFor="rememberMe"
                className="cursor-pointer text-xs text-foreground hover:underline"
              >
                Lembre-se de mim
              </FieldLabel>
            </Field>
            <Link
              to="/recuperar-senha"
              className="ml-auto text-xs font-medium text-foreground underline-offset-4 hover:underline"
            >
              Recuperar senha
            </Link>
          </div>

          <AuthFormSubmit buttonText="Entrar" isSubmitting={isSubmitting} />
          <AuthFormError
            id="login-error"
            error={errors.root?.server?.message}
          />
        </AuthForm>
      </AuthScreenLayout>
    </>
  )
}
