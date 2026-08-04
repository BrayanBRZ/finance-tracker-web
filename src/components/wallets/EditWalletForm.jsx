import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormActions } from '@/components/form-fields/FormActions'
import { FieldGroup } from '@/components/ui/field'
import { WalletFormFields } from '@/components/wallets/WalletFormFields'
import { useWallet } from '@/context/walletContext'
import { walletSchema } from '@/schemas/walletSchema'

export function EditWalletForm({ onSuccess, onError }) {
  const { currentWallet, updateWallet } = useWallet()
  const form = useForm({
    resolver: zodResolver(walletSchema),
    mode: 'onTouched',
    defaultValues: {
      name: currentWallet?.name ?? '',
      description: currentWallet?.description ?? '',
    },
  })
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form

  useEffect(() => {
    reset({
      name: currentWallet?.name ?? '',
      description: currentWallet?.description ?? '',
    })
  }, [currentWallet, reset])

  const submit = async (walletData) => {
    try {
      form.clearErrors('root')
      await updateWallet(walletData)
      onSuccess?.()
    } catch (error) {
      onError?.(error)
      form.setError('root.server', {
        type: 'server',
        message:
          error instanceof Error
            ? error.message
            : 'Não foi possível atualizar a carteira.',
      })
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit(submit)}>
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
