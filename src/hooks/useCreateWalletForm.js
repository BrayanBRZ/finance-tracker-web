import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { walletSchema } from '@/schemas/walletSchema'
import { useWallet } from '@/context/walletContext'

export function useCreateWalletForm() {
  const { createWallet } = useWallet()

  const form = useForm({
    resolver: zodResolver(walletSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const onSubmit = async (walletData) => {
    try {
      form.clearErrors('root')
      await createWallet(walletData)
      form.reset()
    } catch (error) {
      form.setError('root.server', {
        type: 'server',
        message:
          error instanceof Error
            ? error.message
            : 'Não foi possível criar a carteira.',
      })
    }
  }

  return {
    form,
    onSubmit,
  }
}
