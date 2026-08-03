import { TextareaField } from '@/components/forms/TextareaField'
import { TextField } from '@/components/forms/TextField'

export function WalletFormFields({
  register,
  errors,
  disabled,
  idPrefix = 'wallet',
}) {
  return (
    <>
      <TextField
        id={`${idPrefix}-name`}
        label="Nome"
        placeholder="Ex.: Casa, Pessoal, Família"
        autoComplete="off"
        {...register('name')}
        disabled={disabled}
        error={errors?.name?.message}
      />
      <TextareaField
        id={`${idPrefix}-description`}
        label="Descrição"
        rows={3}
        placeholder="Opcional"
        {...register('description')}
        disabled={disabled}
        error={errors?.description?.message}
      />
    </>
  )
}
