import { ControlledSelectField } from '@/components/form-fields/ControlledSelectField'
import { FormActions } from '@/components/form-fields/FormActions'
import { TextField } from '@/components/form-fields/TextField'
import { FieldGroup } from '@/components/ui/field'
import {
  ASSIGNABLE_WALLET_MEMBER_ROLES,
  WALLET_MEMBER_ROLE_LABELS,
} from '@/domain/walletRoles'
import { useAddWalletMemberForm } from '@/hooks/useAddWalletMemberForm'

const roleOptions = ASSIGNABLE_WALLET_MEMBER_ROLES.map((role) => ({
  value: role,
  label: WALLET_MEMBER_ROLE_LABELS[role],
}))

export function AddWalletMemberForm({ onAdd, onSuccess, onError }) {
  const { form, onSubmit } = useAddWalletMemberForm({
    onAdd,
    onSuccess,
    onError,
  })
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup className="gap-4">
        <TextField
          id="wallet-member-email"
          label="E-mail do usuário registrado"
          type="email"
          autoComplete="email"
          {...register('email')}
          disabled={isSubmitting}
          error={errors.email?.message}
        />
        <ControlledSelectField
          control={control}
          name="role"
          id="wallet-member-role"
          label="Papel"
          options={roleOptions}
          disabled={isSubmitting}
        />
        <FormActions
          submitLabel="Adicionar membro"
          pendingLabel="Adicionando..."
          isPending={isSubmitting}
          error={errors.root?.server?.message}
          errorId="wallet-member-form-error"
        />
      </FieldGroup>
    </form>
  )
}
