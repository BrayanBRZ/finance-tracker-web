import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useWallet } from '@/context/walletContext'
import { walletSchema } from '@/schemas/walletSchema'
import { applyApiErrors } from '@/utils/formErrors'

export function useEditWalletForm({ onSuccess, onError }) {
  const { currentWallet, updateWallet } = useWallet()
  const form = useForm({
    resolver: zodResolver(walletSchema),
    mode: 'onTouched',
    defaultValues: { name: currentWallet?.name ?? '', description: currentWallet?.description ?? '' },
  })

  useEffect(() => {
    form.reset({ name: currentWallet?.name ?? '', description: currentWallet?.description ?? '' })
  }, [currentWallet, form])

  const onSubmit = async (data) => {
    try {
      form.clearErrors('root')
      await updateWallet(data)
      onSuccess?.()
    } catch (error) {
      onError?.(error)
      applyApiErrors(form, error)
    }
  }

  return { form, onSubmit }
}
