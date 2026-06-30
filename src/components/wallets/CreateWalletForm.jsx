import { Button } from '@/components/ui/button'
import { ErrorSpan } from '@/components/ErrorSpan'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useCreateWalletForm } from '@/hooks/useCreateWalletForm'

export function CreateWalletForm({ title = 'Criar carteira' }) {
  const {
    form: {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
    },
    onSubmit,
  } = useCreateWalletForm()

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <header>
        <h2 className="text-xl font-semibold text-zinc-950">{title}</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Carteiras separam seus dados financeiros e definem permissões.
        </p>
      </header>

      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="mt-5"
      >
        <FieldGroup className="gap-4">
          <Field>
            <FieldLabel htmlFor="wallet-name">Nome</FieldLabel>
            <Input
              id="wallet-name"
              type="text"
              placeholder="Ex.: Casa, Pessoal, Família"
              autoComplete="off"
              {...register('name')}
              disabled={isSubmitting}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={
                errors.name ? 'wallet-name-error' : undefined
              }
            />
            <ErrorSpan
              id="wallet-name-error"
              error={errors.name?.message}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="wallet-description">
              Descrição
            </FieldLabel>
            <textarea
              id="wallet-description"
              rows={3}
              placeholder="Opcional"
              {...register('description')}
              disabled={isSubmitting}
              aria-invalid={errors.description ? true : undefined}
              aria-describedby={
                errors.description
                  ? 'wallet-description-error'
                  : undefined
              }
              className="w-full resize-none rounded-lg border border-zinc-500 bg-transparent px-3 py-2 text-base text-zinc-950 shadow-sm outline-none transition-colors placeholder:text-zinc-500 focus-visible:border-3 focus-visible:border-blue-900 focus-visible:ring-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:focus-visible:border-red-500"
            />
            <ErrorSpan
              id="wallet-description-error"
              error={errors.description?.message}
            />
          </Field>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 bg-blue-900 text-white hover:opacity-80"
          >
            {isSubmitting ? 'Criando...' : 'Criar carteira'}
          </Button>

          <ErrorSpan
            id="wallet-form-error"
            error={errors.root?.server?.message}
            className="text-sm"
          />
        </FieldGroup>
      </form>
    </section>
  )
}
