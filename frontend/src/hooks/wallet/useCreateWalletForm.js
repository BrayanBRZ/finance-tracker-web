import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useWallet } from '@/context/walletContext'
import { walletSchema } from '@/schemas/walletSchema'
import { applyApiErrors } from '@/utils/formErrors'

export function useCreateWalletForm({ onError } = {}) {
  const { createWallet } = useWallet()
  const form = useForm({
    resolver: zodResolver(walletSchema),
    mode: 'onTouched',
    defaultValues: { name: '', description: '' },
  })

  const onSubmit = async (data) => {
    try {
      form.clearErrors('root')
      const wallet = await createWallet(data)
      form.reset()
      return wallet
    } catch (error) {
      onError?.(error)
      applyApiErrors(form, error)
      return null
    }
  }

  return { form, onSubmit }
}
