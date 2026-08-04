import { useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FINANCIAL_TYPES } from '@/domain/financialTypes'
import { transactionSchema } from '@/schemas/transactionSchema'
import { getErrorMessage } from '@/utils/errors'
import { toDateInputValue } from '@/utils/formatters'

export const NO_CATEGORY_VALUE = '__no_category__'

export function useTransactionForm({ categories, transaction, onSubmit }) {
  const isEditing = Boolean(transaction)
  const form = useForm({
    resolver: zodResolver(transactionSchema),
    mode: 'onTouched',
    values: {
      categoryId: transaction?.categoryId ?? NO_CATEGORY_VALUE,
      type: transaction?.type ?? FINANCIAL_TYPES.EXPENSE,
      description: transaction?.description ?? '',
      amount: transaction?.amount ?? '',
      transactionDate: transaction?.transactionDate ?? toDateInputValue(),
    },
  })
  const selectedType = useWatch({ control: form.control, name: 'type' })
  const categoryOptions = useMemo(
    () => [
      { value: NO_CATEGORY_VALUE, label: 'Sem categoria' },
      ...categories
        .filter((category) => category.type === selectedType)
        .map((category) => ({ value: category.id, label: category.name })),
    ],
    [categories, selectedType],
  )

  const onTypeChange = (field, nextType) => {
    field.onChange(nextType)
    const selectedCategory = categories.find(
      (category) => category.id === form.getValues('categoryId'),
    )

    if (selectedCategory && selectedCategory.type !== nextType) {
      form.setValue('categoryId', NO_CATEGORY_VALUE, {
        shouldDirty: true,
        shouldValidate: true,
      })
    }
  }

  const submit = async (transactionData) => {
    try {
      form.clearErrors('root')
      await onSubmit({
        ...transactionData,
        categoryId:
          transactionData.categoryId === NO_CATEGORY_VALUE
            ? null
            : transactionData.categoryId,
      })
      if (!isEditing) form.reset()
    } catch (error) {
      form.setError('root.server', {
        type: 'server',
        message: getErrorMessage(error, 'Não foi possível salvar a transação.'),
      })
    }
  }

  return { form, isEditing, categoryOptions, onTypeChange, onSubmit: submit }
}
