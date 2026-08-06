import { CategoryIcon } from '@/components/categories/CategoryIndicator'
import { ControlledSelectField } from '@/components/form-fields/ControlledSelectField'
import { FormActions } from '@/components/form-fields/FormActions'
import { TextField } from '@/components/form-fields/TextField'
import { FieldGroup } from '@/components/ui/field'
import { FINANCIAL_TYPE_OPTIONS } from '@/domain/financialTypes'
import { useCategoryForm } from '@/hooks/category/useCategoryForm'

export function CategoryForm({
  appearanceOptions,
  category,
  onSubmit,
  onCancel,
}) {
  const {
    form,
    isEditing,
    colorOptions,
    iconOptions,
    selectedColor,
    onSubmit: submit,
  } = useCategoryForm({ appearanceOptions, category, onSubmit })
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

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
