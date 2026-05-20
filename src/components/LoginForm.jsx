import { Loader } from 'lucide-react'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Button } from '@/components/ui/button'
import { Checkbox } from "@/components/ui/checkbox"
import { useNavigate } from 'react-router-dom';

import { useLogin } from '@/hooks/useLogin'

export function LoginForm() {
  const navigate = useNavigate()

  const {
    form: { register, handleSubmit, formState: { errors, isSubmitting } },
    authError,
    handleLogin
  } = useLogin();

  return (
    <section className="grid p-0 md:grid-cols-2 h-full">

      {/* Left – Form */}
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="p-5 md: flex flex-col justify-center items-center relative bg-white h-full w-full"
      >

        <FieldGroup className="flex flex-col max-w-md gap-2 p-4">

          {/* Header */}
          <header className="flex flex-col items-start gap-2 mt-2 mb-2">

            <h1 className="text-4xl tracking-tight text-zinc-950">
              Efetuar login
            </h1>

            <p className="mt-2 text-base text-zinc-500">
              Não possui uma conta?{' '}
              <span
                onClick={() => navigate('/cadastro')}
                className="text-zinc-950 hover:underline cursor-pointer text-base"
              >
                Cadastre-se
              </span>
            </p>

          </header>

          {/* Fields */}
          <div className="flex flex-col gap-2">

            {/* E-mail */}
            <Field className="flex flex-col">
              <FieldLabel htmlFor="email" className="text-lg text-zinc-500">
                E-mail
              </FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="nome@exemplo.com"
                {...register('email')}
                disabled={isSubmitting}
                aria-invalid={!!errors.email || !!authError}
              />
              <span className="text-xs text-red-500 min-h-4">
                {errors.email?.message || authError || ''}
              </span>
            </Field>

            {/* Pass */}
            <Field className="flex flex-col">
              <FieldLabel htmlFor="password" className="text-lg text-zinc-500">Senha</FieldLabel>
              <PasswordInput
                id="password"
                placeholder="Sua senha"
                {...register('password')}
                disabled={isSubmitting}
                aria-invalid={!!errors.password || !!authError}
              />
              <span className="text-xs text-red-500 min-h-4">
                {errors.password?.message || authError || ''}
              </span>
            </Field>
          </div>

          {/* Options */}
          <div className="flex justify-between">
            <Field orientation="horizontal" className="flex items-center gap-2 max-w-40">
              <Checkbox id="remember-me" className="cursor-pointer border-zinc-400" />
              <FieldLabel htmlFor="remember-me" className="text-sm text-zinc-950 hover:underline cursor-pointer">Remember me</FieldLabel>
            </Field>

            <a href="#" className="text-zinc-950 hover:underline text-sm max-w-40">
              Esqueceu a senha?
            </a>
          </div>


          {/* Action Button */}
          <Field>
            <Button
              type="submit"
              disabled={isSubmitting}
              className=
              {`h-13 w-full mt-6 transition-all shadow-md hover:cursor-pointer border-0 text-lg
                  ${isSubmitting
                  ? 'cursor-not-allowed bg-zinc-400 opacity-70'
                  : 'cursor-pointer bg-blue-900 hover:opacity-70'
                } `}
            >
              {isSubmitting ? <Loader className="animate-spin text-zinc-950" size={24} /> : 'Entrar'}
            </Button>
          </Field>

        </FieldGroup>

      </form>

      {/* Right - Placeholder */}
      <div className="hidden md:flex flex-col justify-center items-center relative overflow-hidden bg-[#08205d]">
        <div className="absolute w-125 h-125 bg-white/10 rounded-full blur-[120px] z-0" />
      </div>

    </section>
  )
}
