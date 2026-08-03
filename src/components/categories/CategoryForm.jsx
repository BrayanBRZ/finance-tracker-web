import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CategoryIcon } from '@/components/categories/CategoryIndicator'
import { ControlledSelectField } from '@/components/forms/ControlledSelectField'
import { FormActions } from '@/components/forms/FormActions'
import { TextField } from '@/components/forms/TextField'
import { FieldGroup } from '@/components/ui/field'
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
        <ControlledSelectField
          control={control}
          name="type"
          id="category-type"
          label="Tipo"
          placeholder="Selecione o tipo"
          options={FINANCIAL_TYPE_OPTIONS}
          disabled={isSubmitting}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <ControlledSelectField
            control={control}
            name="color"
            id="category-color"
            label="Cor"
            placeholder="Selecione uma cor"
            options={colorOptions}
            disabled={isSubmitting}
            renderOption={(option) => (
              <>
                <span
                  className="size-3 rounded-[2px]"
                  style={{ backgroundColor: option.value }}
                  aria-hidden="true"
                />
                {option.label}
              </>
            )}
          />
          <ControlledSelectField
            control={control}
            name="icon"
            id="category-icon"
            label="Ícone"
            placeholder="Selecione um ícone"
            options={iconOptions}
            disabled={isSubmitting}
            renderOption={(option) => (
              <>
                <CategoryIcon
                  icon={option.value}
                  color={selectedColor}
                  className="size-6"
                  iconClassName="size-3.5"
                />
                {option.label}
              </>
            )}
          />
        </div>
        <FormActions
          submitLabel={isEditing ? 'Salvar alterações' : 'Criar categoria'}
          pendingLabel="Salvando..."
          isPending={isSubmitting}
          onCancel={isEditing ? onCancel : undefined}
          error={errors.root?.server?.message}
          errorId="category-form-error"
        />
      </FieldGroup>
    </form>
  )
}
