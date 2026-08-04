import { useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { categorySchema } from '@/schemas/categorySchema'
import { getErrorMessage } from '@/utils/errors'

const includeLegacyOption = (options, value, label) => {
  if (!value || options.some((option) => option.value === value)) return options

  return [{ value, label }, ...options]
}

export function useCategoryForm({ appearanceOptions, category, onSubmit }) {
  const isEditing = Boolean(category)
  const colorOptions = useMemo(
    () =>
      includeLegacyOption(
        appearanceOptions.colors,
        category?.color,
        `Cor atual (${category?.color})`,
      ),
    [appearanceOptions.colors, category?.color],
  )
  const iconOptions = useMemo(
    () =>
      includeLegacyOption(
        appearanceOptions.icons,
        category?.icon,
        `Ícone atual (${category?.icon})`,
      ),
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

  const submit = async (categoryData) => {
    try {
      form.clearErrors('root')
      await onSubmit(categoryData)
      if (!isEditing) form.reset()
    } catch (error) {
      form.setError('root.server', {
        type: 'server',
        message: getErrorMessage(error, 'Não foi possível salvar a categoria.'),
      })
    }
  }

  return {
    form,
    isEditing,
    colorOptions,
    iconOptions,
    selectedColor,
    onSubmit: submit,
  }
}
