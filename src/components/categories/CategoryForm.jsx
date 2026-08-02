import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CategoryIcon } from '@/components/categories/CategoryIndicator'
import { Button } from '@/components/ui/button'
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

const includeLegacyOption = (options, value, label) => {
  if (!value || options.some((option) => option.value === value)) return options

  return [{ value, label }, ...options]
}

export function CategoryForm({
  appearanceOptions,
  category,
  onSubmit,
  onCancel,
}) {
  const isEditing = Boolean(category)
  const colorOptions = includeLegacyOption(
    appearanceOptions.colors,
    category?.color,
    `Cor atual (${category?.color})`,
  )
  const iconOptions = includeLegacyOption(
    appearanceOptions.icons,
    category?.icon,
    `Ícone atual (${category?.icon})`,
  )
  const form = useForm({
    resolver: zodResolver(categorySchema),
    mode: 'onTouched',
    values: {
      name: category?.name ?? '',
      type: category?.type ?? '',
      icon: category?.icon ?? appearanceOptions.icons[0]?.value ?? '',
      color: category?.color ?? appearanceOptions.colors[0]?.value ?? '',
    },
  })
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form
  const selectedColor = useWatch({ control, name: 'color' })

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
          <Controller
            control={control}
            name="color"
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="category-color">Cor</FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  onOpenChange={(isOpen) => {
                    if (!isOpen) field.onBlur()
                  }}
                  disabled={isSubmitting}
                >
                  <SelectTrigger
                    id="category-color"
                    aria-invalid={errors.color ? true : undefined}
                  >
                    <SelectValue placeholder="Selecione uma cor" />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <span
                          className="size-3 rounded-[2px]"
                          style={{ backgroundColor: option.value }}
                          aria-hidden="true"
                        />
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ErrorSpan
                  id="category-color-error"
                  error={errors.color?.message}
                />
              </Field>
            )}
          />
          <Controller
            control={control}
            name="icon"
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="category-icon">Ícone</FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  onOpenChange={(isOpen) => {
                    if (!isOpen) field.onBlur()
                  }}
                  disabled={isSubmitting}
                >
                  <SelectTrigger
                    id="category-icon"
                    aria-invalid={errors.icon ? true : undefined}
                  >
                    <SelectValue placeholder="Selecione um ícone" />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <CategoryIcon
                          icon={option.value}
                          color={selectedColor}
                          className="size-6"
                          iconClassName="size-3.5"
                        />
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ErrorSpan
                  id="category-icon-error"
                  error={errors.icon?.message}
                />
              </Field>
            )}
          />
        </div>
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? 'Salvando...'
                  : isEditing
                    ? 'Salvar alterações'
                    : 'Criar categoria'}
              </Button>
              {isEditing ? (
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
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
  )
}
