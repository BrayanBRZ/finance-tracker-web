import { useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FINANCIAL_TYPES } from '@/domain/financialTypes'
import { transactionSchema } from '@/schemas/transactionSchema'
import { applyApiErrors } from '@/utils/formErrors'
import { toDateInputValue } from '@/utils/formatters'

export const NO_CATEGORY_VALUE = '__no_category__'

export function useTransactionForm({ categories, transaction, onSubmit }) {
  const isEditing = Boolean(transaction)
  const form = useForm({
    resolver: zodResolver(transactionSchema),
    mode: 'onTouched',
    values: {
      categoryId: transaction?.category?.id ? String(transaction.category.id) : NO_CATEGORY_VALUE,
      type: transaction?.type ?? FINANCIAL_TYPES.EXPENSE,
      description: transaction?.description ?? '',
      amount: transaction?.amount ?? '',
      date: transaction?.date ?? toDateInputValue(),
    },
  })
  const selectedType = useWatch({ control: form.control, name: 'type' })
  const categoryOptions = useMemo(
    () => [
      { value: NO_CATEGORY_VALUE, label: 'Sem categoria' },
      ...categories
        .filter((category) => category.type === selectedType)
        .map((category) => ({ value: String(category.id), label: category.name })),
    ],
    [categories, selectedType],
  )

  const onTypeChange = (field, nextType) => {
    field.onChange(nextType)
    const selectedCategory = categories.find(
      (category) => String(category.id) === form.getValues('categoryId'),
    )
    if (selectedCategory && selectedCategory.type !== nextType) {
      form.setValue('categoryId', NO_CATEGORY_VALUE, { shouldDirty: true, shouldValidate: true })
    }
  }

  const submit = async (data) => {
    try {
      form.clearErrors('root')
      await onSubmit({
        ...data,
        description: data.description || null,
        categoryId: data.categoryId === NO_CATEGORY_VALUE ? null : Number(data.categoryId),
      })
      if (!isEditing) form.reset()
    } catch (error) {
      applyApiErrors(form, error)
    }
  }

  return { form, isEditing, categoryOptions, onTypeChange, onSubmit: submit }
}
