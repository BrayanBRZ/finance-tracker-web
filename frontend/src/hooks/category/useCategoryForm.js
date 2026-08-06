import { useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { categorySchema } from '@/schemas/categorySchema'
import { applyApiErrors } from '@/utils/formErrors'

const includeLegacyOption = (options, value, label) =>
  !value || options.some((option) => option.value === value)
    ? options
    : [{ value, label }, ...options]

export function useCategoryForm({ appearanceOptions, category, onSubmit }) {
  const isEditing = Boolean(category)
  const colorOptions = useMemo(
    () => includeLegacyOption(appearanceOptions.colors, category?.color, `Cor atual (${category?.color})`),
    [appearanceOptions.colors, category?.color],
  )
  const iconOptions = useMemo(
    () => includeLegacyOption(appearanceOptions.icons, category?.icon, `Ícone atual (${category?.icon})`),
    [appearanceOptions.icons, category?.icon],
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
  const selectedColor = useWatch({ control: form.control, name: 'color' })

  const submit = async (data) => {
    try {
      form.clearErrors('root')
      await onSubmit(data)
      if (!isEditing) form.reset()
    } catch (error) {
      applyApiErrors(form, error)
    }
  }

  return { form, isEditing, colorOptions, iconOptions, selectedColor, onSubmit: submit }
}
