import { Controller } from 'react-hook-form'
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
import { FormInputField } from '@/components/forms/FormInputField'
import { FINANCIAL_TYPE_OPTIONS } from '@/domain/financialTypes'
import { useCreateCategoryForm } from '@/hooks/useCreateCategoryForm'

export function CreateCategoryForm({ createCategory, disabled = false }) {
  const {
    form: {
      control,
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
    },
    onSubmit,
  } = useCreateCategoryForm({ createCategory })

  const isDisabled = disabled || isSubmitting

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Criar categoria</CardTitle>
        <CardDescription>
          Categorias pertencem à carteira atual e serão usadas nos lançamentos.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4">
            <FormInputField
              id="category-name"
              label="Nome"
              placeholder="Ex.: Mercado, Salário, Transporte"
              autoComplete="off"
              {...register('name')}
              disabled={isDisabled}
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
                      if (!isOpen) {
                        field.onBlur()
                      }
                    }}
                    disabled={isDisabled}
                  >
                    <SelectTrigger
                      id="category-type"
                      className="h-11 w-full"
                      aria-invalid={errors.type ? true : undefined}
                      aria-describedby={
                        errors.type ? 'category-type-error' : undefined
                      }
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
                  <ErrorSpan
                    id="category-type-error"
                    error={errors.type?.message}
                  />
                </Field>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormInputField
                id="category-icon"
                label="Ícone"
                placeholder="Opcional"
                autoComplete="off"
                {...register('icon')}
                disabled={isDisabled}
                error={errors.icon?.message}
              />

              <FormInputField
                id="category-color"
                label="Cor"
                placeholder="Opcional"
                autoComplete="off"
                {...register('color')}
                disabled={isDisabled}
                error={errors.color?.message}
              />
            </div>

            <Button type="submit" disabled={isDisabled} className="h-11">
              {isSubmitting ? 'Criando...' : 'Criar categoria'}
            </Button>

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
