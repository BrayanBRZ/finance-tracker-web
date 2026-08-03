import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ControlledSelectField } from '@/components/forms/ControlledSelectField'
import { FormActions } from '@/components/forms/FormActions'
import { TextField } from '@/components/forms/TextField'
import { FieldGroup } from '@/components/ui/field'
import {
  ASSIGNABLE_WALLET_MEMBER_ROLES,
  WALLET_MEMBER_ROLE_LABELS,
} from '@/domain/walletRoles'
import { walletMemberSchema } from '@/schemas/walletMemberSchema'

const roleOptions = ASSIGNABLE_WALLET_MEMBER_ROLES.map((role) => ({
  value: role,
  label: WALLET_MEMBER_ROLE_LABELS[role],
}))

export function AddWalletMemberForm({ onAdd, onSuccess, onError }) {
  const form = useForm({
    resolver: zodResolver(walletMemberSchema),
    mode: 'onTouched',
    defaultValues: {
      email: '',
      role: ASSIGNABLE_WALLET_MEMBER_ROLES[0],
    },
  })
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form

  const submit = async (memberData) => {
    try {
      form.clearErrors('root')
      await onAdd(memberData)
      reset()
      onSuccess?.()
    } catch (error) {
      onError?.(error)
      form.setError('root.server', {
        type: 'server',
        message:
          error instanceof Error
            ? error.message
            : 'Não foi possível adicionar o membro.',
      })
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit(submit)}>
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
