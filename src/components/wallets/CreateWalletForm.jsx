import { Button } from '@/components/ui/button'
import { ErrorSpan } from '@/components/forms/ErrorSpan'
import { FieldGroup } from '@/components/ui/field'
import { TextareaField } from '@/components/forms/TextareaField'
import { TextField } from '@/components/forms/TextField'
import { useCreateWalletForm } from '@/hooks/useCreateWalletForm'

export function CreateWalletForm({ onSuccess, onError }) {
  const {
    form: {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
    },
    onSubmit: createWallet,
  } = useCreateWalletForm({ onError })

  const onSubmit = async (walletData) => {
    const wallet = await createWallet(walletData)
    if (wallet) onSuccess?.()
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup className="gap-4">
        <TextField
          id="wallet-name"
          label="Nome"
          placeholder="Ex.: Casa, Pessoal, Família"
          autoComplete="off"
          {...register('name')}
          disabled={isSubmitting}
          error={errors.name?.message}
        />

        <TextareaField
          id="wallet-description"
          label="Descrição"
          rows={3}
          placeholder="Opcional"
          {...register('description')}
          disabled={isSubmitting}
          error={errors.description?.message}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Criando...' : 'Criar carteira'}
        </Button>

        <ErrorSpan
          id="wallet-form-error"
          error={errors.root?.server?.message}
          className="text-sm"
        />
      </FieldGroup>
    </form>
  )
}
