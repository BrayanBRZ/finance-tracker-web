import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ASSIGNABLE_WALLET_MEMBER_ROLES } from '@/domain/walletRoles'
import { walletMemberSchema } from '@/schemas/walletMemberSchema'
import { getErrorMessage } from '@/utils/errors'

export function useAddWalletMemberForm({ onAdd, onSuccess, onError }) {
  const form = useForm({
    resolver: zodResolver(walletMemberSchema),
    mode: 'onTouched',
    defaultValues: {
      email: '',
      role: ASSIGNABLE_WALLET_MEMBER_ROLES[0],
    },
  })

  const onSubmit = async (memberData) => {
    try {
      form.clearErrors('root')
      await onAdd(memberData)
      form.reset()
      onSuccess?.()
    } catch (error) {
      onError?.(error)
      form.setError('root.server', {
        type: 'server',
        message: getErrorMessage(error, 'Não foi possível adicionar o membro.'),
      })
    }
  }

  return { form, onSubmit }
}
