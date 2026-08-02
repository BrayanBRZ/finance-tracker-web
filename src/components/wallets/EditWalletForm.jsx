import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FieldGroup } from '@/components/ui/field'
import { ErrorSpan } from '@/components/forms/ErrorSpan'
import { TextareaField } from '@/components/forms/TextareaField'
import { TextField } from '@/components/forms/TextField'
import { useWallet } from '@/context/walletContext'
import { walletSchema } from '@/schemas/walletSchema'

export function EditWalletForm() {
  const { currentWallet, updateWallet } = useWallet()
  const form = useForm({
    resolver: zodResolver(walletSchema),
    mode: 'onTouched',
    defaultValues: {
      name: currentWallet?.name ?? '',
      description: currentWallet?.description ?? '',
    },
  })
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form

  useEffect(() => {
    reset({
      name: currentWallet?.name ?? '',
      description: currentWallet?.description ?? '',
    })
  }, [currentWallet, reset])

  const onSubmit = async (walletData) => {
    try {
      form.clearErrors('root')
      await updateWallet(walletData)
    } catch (error) {
      form.setError('root.server', {
        type: 'server',
        message:
          error instanceof Error
            ? error.message
            : 'Não foi possível atualizar a carteira.',
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Informações da carteira</CardTitle>
        <CardDescription>
          Atualize o nome e a descrição visíveis aos membros.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4">
            <TextField
              id="edit-wallet-name"
              label="Nome"
              autoComplete="off"
              {...register('name')}
              disabled={isSubmitting}
              error={errors.name?.message}
            />
            <TextareaField
              id="edit-wallet-description"
              label="Descrição"
              rows={3}
              {...register('description')}
              disabled={isSubmitting}
              error={errors.description?.message}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
            </Button>
            <ErrorSpan
              id="edit-wallet-error"
              error={errors.root?.server?.message}
              className="text-sm"
            />
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
