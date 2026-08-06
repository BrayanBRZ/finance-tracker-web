import { FormActions } from '@/components/form-fields/FormActions'
import { FieldGroup } from '@/components/ui/field'
import { WalletFormFields } from '@/components/wallets/WalletFormFields'
import { useEditWalletForm } from '@/hooks/wallet/useEditWalletForm'

export function EditWalletForm({ onSuccess, onError }) {
  const { form, onSubmit } = useEditWalletForm({ onSuccess, onError })
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup className="gap-4">
        <WalletFormFields
          register={register}
          errors={errors}
          disabled={isSubmitting}
          idPrefix="edit-wallet"
        />
        <FormActions
          submitLabel="Salvar alterações"
          pendingLabel="Salvando..."
          isPending={isSubmitting}
          error={errors.root?.server?.message}
          errorId="edit-wallet-error"
        />
      </FieldGroup>
    </form>
  )
}
