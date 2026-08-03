import { FormActions } from '@/components/forms/FormActions'
import { FieldGroup } from '@/components/ui/field'
import { WalletFormFields } from '@/components/wallets/WalletFormFields'
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

  const submit = async (walletData) => {
    const wallet = await createWallet(walletData)
    if (wallet) onSuccess?.()
  }

  return (
    <form noValidate onSubmit={handleSubmit(submit)}>
      <FieldGroup className="gap-4">
        <WalletFormFields
          register={register}
          errors={errors}
          disabled={isSubmitting}
        />
        <FormActions
          submitLabel="Criar carteira"
          pendingLabel="Criando..."
          isPending={isSubmitting}
          error={errors.root?.server?.message}
          errorId="wallet-form-error"
        />
      </FieldGroup>
    </form>
  )
}
