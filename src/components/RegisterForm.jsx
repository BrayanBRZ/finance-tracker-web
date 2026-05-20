import { Loader, CheckCircle2 } from 'lucide-react'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useRegister } from '@/hooks/useRegister'

export function RegisterForm() {
  const navigate = useNavigate()

  const {
    form: { register, handleSubmit, formState: { errors, isSubmitting } },
    authError,
    success,
    handleRegister,
  } = useRegister()

  return (
    <section className="grid p-0 md:grid-cols-2 h-full">

      {/* Left – Placeholder */}
      <div className="hidden md:flex flex-col justify-center items-center relative overflow-hidden bg-[#08205d]">
        <div className="absolute w-125 h-125 bg-white/10 rounded-full blur-[120px] z-0" />
      </div>

      {/* Right – Form */}
      <form
        onSubmit={handleSubmit(handleRegister)}
        className="p-5 flex flex-col justify-center items-center relative bg-white h-full w-full"
      >
        <FieldGroup className="flex flex-col gap-2 p-4 w-full max-w-md">

          <header className="flex flex-col items-start gap-2 mt-2 mb-2">

            <h1 className="text-4xl tracking-tight text-zinc-950">
              Criar conta
            </h1>

            <p className="mt-2 text-base text-zinc-500">
              Já tem uma conta?{' '}
              <span
                onClick={() => navigate('/login')}
                className="font-medium text-zinc-950 hover:underline cursor-pointer"
              >
                Entrar
              </span>
            </p>

          </header>

          {/* {success && (
            <div className="flex items-center gap-2 rounded-md bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">
              <CheckCircle2 size={16} />
              Conta criada! Redirecionando para o login…
            </div>
          )} */}

          {/* Fields */}
          <div className="flex flex-col gap-2">

            {/* Name */}
            <Field className="flex flex-col">
              <FieldLabel id="name" className="text-lg font-medium text-zinc-500">Nome completo</FieldLabel>
              <Input
                id="name"
                placeholder="Seu nome"
                {...register('name', { required: 'Campo obrigatório' })}
                disabled={isSubmitting || success}
                aria-invalid={!!errors.name} // <-- O erro agora é controlado nativamente!
              />
              <span className="text-sm font-medium text-red-500 min-h-4">
                {errors.name?.message || ''}
              </span>
            </Field>

            {/* E-mail */}
            <Field className="flex flex-col">
              <FieldLabel className="text-lg font-medium text-zinc-500">E-mail</FieldLabel>
              <Input
                type="email"
                placeholder="nome@exemplo.com"
                {...register('email', {
                  required: 'Campo obrigatório',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'E-mail inválido' },
                })}
                disabled={isSubmitting || success}
                aria-invalid={!!errors.email || !!authError}
              />
              <span className="text-sm font-medium text-red-500 min-h-4">
                {errors.email?.message || authError || ''}
              </span>
            </Field>

            {/* Senha */}
            <Field className="flex flex-col">
              <FieldLabel className="text-lg font-medium text-zinc-500">Senha</FieldLabel>
              <PasswordInput
                placeholder="Mínimo 6 caracteres"
                {...register('password', {
                  required: 'Campo obrigatório',
                  minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                })}
                disabled={isSubmitting || success}
                aria-invalid={!!errors.password}
              />
              <span className="text-sm font-medium text-red-500 min-h-4">
                {errors.password?.message || ''}
              </span>
            </Field>

            {/* Confirmar senha */}
            <Field className="flex flex-col">
              <FieldLabel className="text-lg font-medium text-zinc-500">Confirmar senha</FieldLabel>
              <PasswordInput
                placeholder="Repita a senha"
                {...register('confirmPassword', { required: 'Campo obrigatório' })}
                disabled={isSubmitting || success}
                aria-invalid={!!errors.confirmPassword}
              />
              <span className="text-sm font-medium text-red-500 min-h-4">
                {errors.confirmPassword?.message || ''}
              </span>
            </Field>
          </div>

          <Field>
            <Button
              type="submit"
              disabled={isSubmitting || success}
              className={`h-13 w-full mt-4 text-lg font-medium transition-all shadow-md border-0 ${isSubmitting || success
                  ? 'cursor-not-allowed bg-zinc-400 opacity-70'
                  : 'bg-blue-900 text-white hover:opacity-70'
                }`}
            >
              {isSubmitting ? <Loader className="animate-spin" size={24} /> : 'Criar conta'}
            </Button>
          </Field>

        </FieldGroup>

      </form>
      
    </section>
  )
}