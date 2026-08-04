import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useWallet } from '@/context/walletContext'
import { walletSchema } from '@/schemas/walletSchema'
import { getErrorMessage } from '@/utils/errors'

export function useEditWalletForm({ onSuccess, onError }) {
  const { currentWallet, updateWallet } = useWallet()
  const form = useForm({
    resolver: zodResolver(walletSchema),
    mode: 'onTouched',
    defaultValues: {
      name: currentWallet?.name ?? '',
      description: currentWallet?.description ?? '',
    },
  })

  useEffect(() => {
    form.reset({
      name: currentWallet?.name ?? '',
      description: currentWallet?.description ?? '',
    })
  }, [currentWallet, form])

  const onSubmit = async (walletData) => {
    try {
      form.clearErrors('root')
      await updateWallet(walletData)
      onSuccess?.()
    } catch (error) {
      onError?.(error)
      form.setError('root.server', {
        type: 'server',
        message: getErrorMessage(error, 'Não foi possível atualizar a carteira.'),
      })
    }
  }

  return { form, onSubmit }
}
