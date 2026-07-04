import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ErrorSpan } from '@/components/forms/ErrorSpan'
import { FormInputField } from '@/components/forms/FormInputField'
import { FieldGroup } from '@/components/ui/field'
import { useCreateWalletForm } from '@/hooks/useCreateWalletForm'

export function CreateWalletForm({ title = 'Criar carteira' }) {
  const {
    form: {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
    },
    onSubmit,
  } = useCreateWalletForm()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>
          Carteiras separam seus dados financeiros e definem permissões.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4">
            <FormInputField
              id="wallet-name"
              label="Nome"
              placeholder="Ex.: Casa, Pessoal, Família"
              autoComplete="off"
              {...register('name')}
              disabled={isSubmitting}
              error={errors.name?.message}
            />

            <FormInputField
              as="textarea"
              id="wallet-description"
              label="Descrição"
              rows={3}
              placeholder="Opcional"
              {...register('description')}
              disabled={isSubmitting}
              error={errors.description?.message}
            />

            <Button type="submit" disabled={isSubmitting} className="h-11">
              {isSubmitting ? 'Criando...' : 'Criar carteira'}
            </Button>

            <ErrorSpan
              id="wallet-form-error"
              error={errors.root?.server?.message}
              className="text-sm"
            />
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
