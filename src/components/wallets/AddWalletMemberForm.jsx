import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { ErrorSpan } from '@/components/forms/ErrorSpan'
import { TextField } from '@/components/forms/TextField'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ASSIGNABLE_WALLET_MEMBER_ROLES,
  WALLET_MEMBER_ROLE_LABELS,
} from '@/domain/walletRoles'
import { walletMemberSchema } from '@/schemas/walletMemberSchema'

export function AddWalletMemberForm({ onAdd }) {
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

  const onSubmit = async (memberData) => {
    try {
      form.clearErrors('root')
      await onAdd(memberData)
      reset()
    } catch (error) {
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
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-5">
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
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="wallet-member-role">Papel</FieldLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                onOpenChange={(isOpen) => {
                  if (!isOpen) field.onBlur()
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger id="wallet-member-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASSIGNABLE_WALLET_MEMBER_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {WALLET_MEMBER_ROLE_LABELS[role]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <ErrorSpan
                id="wallet-member-role-error"
                error={errors.role?.message}
              />
            </Field>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="h-11">
          {isSubmitting ? 'Adicionando...' : 'Adicionar membro'}
        </Button>
        <ErrorSpan
          id="wallet-member-form-error"
          error={errors.root?.server?.message}
          className="text-sm"
        />
      </FieldGroup>
    </form>
  )
}
