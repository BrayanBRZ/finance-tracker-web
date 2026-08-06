import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ASSIGNABLE_WALLET_MEMBER_ROLES } from '@/domain/walletRoles'
import { walletMemberSchema } from '@/schemas/walletMemberSchema'
import { applyApiErrors } from '@/utils/formErrors'

export function useAddWalletMemberForm({ onAdd, onSuccess, onError }) {
  const form = useForm({
    resolver: zodResolver(walletMemberSchema),
    mode: 'onTouched',
    defaultValues: { email: '', role: ASSIGNABLE_WALLET_MEMBER_ROLES[0] },
  })

  const onSubmit = async (data) => {
    try {
      form.clearErrors('root')
      await onAdd(data)
      form.reset()
      onSuccess?.()
    } catch (error) {
      onError?.(error)
      applyApiErrors(form, error)
    }
  }

  return { form, onSubmit }
}
