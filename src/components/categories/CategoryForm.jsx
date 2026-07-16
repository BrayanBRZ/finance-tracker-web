import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ErrorSpan } from '@/components/forms/ErrorSpan'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TextField } from '@/components/forms/TextField'
import { FINANCIAL_TYPE_OPTIONS } from '@/domain/financialTypes'
import { categorySchema } from '@/schemas/categorySchema'

export function CategoryForm({ category, onSubmit, onCancel }) {
  const isEditing = Boolean(category)
  const form = useForm({
    resolver: zodResolver(categorySchema),
    mode: 'onTouched',
    values: {
      name: category?.name ?? '',
      type: category?.type ?? '',
      icon: category?.icon ?? '',
      color: category?.color ?? '',
    },
  })
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form

  const submit = async (categoryData) => {
    try {
      form.clearErrors('root')
      await onSubmit(categoryData)
      if (!isEditing) reset()
    } catch (error) {
      form.setError('root.server', {
        type: 'server',
        message:
          error instanceof Error
            ? error.message
            : 'Não foi possível salvar a categoria.',
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">
          {isEditing ? 'Editar categoria' : 'Criar categoria'}
        </CardTitle>
        <CardDescription>
          Categorias são pessoais e podem classificar lançamentos das suas carteiras.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form noValidate onSubmit={handleSubmit(submit)}>
          <FieldGroup className="gap-4">
            <TextField
              id="category-name"
              label="Nome"
              placeholder="Ex.: Mercado, Salário, Transporte"
              autoComplete="off"
              {...register('name')}
              disabled={isSubmitting}
              error={errors.name?.message}
            />
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="category-type">Tipo</FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    onOpenChange={(isOpen) => {
                      if (!isOpen) field.onBlur()
                    }}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger
                      id="category-type"
                      aria-invalid={errors.type ? true : undefined}
                    >
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {FINANCIAL_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ErrorSpan id="category-type-error" error={errors.type?.message} />
                </Field>
              )}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                id="category-icon"
                label="Ícone"
                placeholder="Opcional"
                autoComplete="off"
                {...register('icon')}
                disabled={isSubmitting}
                error={errors.icon?.message}
              />
              <TextField
                id="category-color"
                label="Cor"
                placeholder="Opcional"
                autoComplete="off"
                {...register('color')}
                disabled={isSubmitting}
                error={errors.color?.message}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={isSubmitting} className="h-11">
                {isSubmitting
                  ? 'Salvando...'
                  : isEditing
                    ? 'Salvar alterações'
                    : 'Criar categoria'}
              </Button>
              {isEditing ? (
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting} className="h-11">
                  Cancelar
                </Button>
              ) : null}
            </div>
            <ErrorSpan
              id="category-form-error"
              error={errors.root?.server?.message}
              className="text-sm"
            />
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
