import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ControlledSelectField } from '@/components/forms/ControlledSelectField'
import { FormActions } from '@/components/forms/FormActions'
import { TextField } from '@/components/forms/TextField'
import { FieldGroup } from '@/components/ui/field'
import {
  FINANCIAL_TYPE_OPTIONS,
  FINANCIAL_TYPES,
} from '@/domain/financialTypes'
import { transactionSchema } from '@/schemas/transactionSchema'
import { toDateInputValue } from '@/utils/formatters'

const NO_CATEGORY_VALUE = '__no_category__'

export function TransactionForm({
  categories,
  transaction,
  onSubmit,
  onCancel,
}) {
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
  const {
    control,
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = form
  const selectedType = useWatch({ control, name: 'type' })
  const categoryOptions = [
    { value: NO_CATEGORY_VALUE, label: 'Sem categoria' },
    ...categories
      .filter((category) => category.type === selectedType)
      .map((category) => ({ value: category.id, label: category.name })),
  ]

  const changeTransactionType = (field, nextType) => {
    field.onChange(nextType)

    const selectedCategory = categories.find(
      (category) => category.id === getValues('categoryId'),
    )

    if (selectedCategory && selectedCategory.type !== nextType) {
      setValue('categoryId', NO_CATEGORY_VALUE, {
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
      if (!isEditing) reset()
    } catch (error) {
      form.setError('root.server', {
        type: 'server',
        message:
          error instanceof Error
            ? error.message
            : 'Não foi possível salvar a transação.',
      })
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit(submit)}>
      <FieldGroup className="gap-4">
        <ControlledSelectField
          control={control}
          name="type"
          id="transaction-type"
          label="Tipo"
          placeholder="Selecione o tipo"
          options={FINANCIAL_TYPE_OPTIONS}
          disabled={isSubmitting}
          onValueChange={(nextType, field) =>
            changeTransactionType(field, nextType)
          }
        />
        <ControlledSelectField
          control={control}
          name="categoryId"
          id="transaction-category"
          label="Categoria"
          placeholder="Sem categoria"
          options={categoryOptions}
          disabled={isSubmitting}
        />
        <TextField
          id="transaction-description"
          label="Descrição"
          autoComplete="off"
          {...register('description')}
          disabled={isSubmitting}
          error={errors.description?.message}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="transaction-amount"
            label="Valor"
            type="number"
            min="0.01"
            step="0.01"
            inputMode="decimal"
            {...register('amount')}
            disabled={isSubmitting}
            error={errors.amount?.message}
          />
          <TextField
            id="transaction-date"
            label="Data"
            type="date"
            {...register('transactionDate')}
            disabled={isSubmitting}
            error={errors.transactionDate?.message}
          />
        </div>
        <FormActions
          submitLabel={isEditing ? 'Salvar alterações' : 'Registrar transação'}
          pendingLabel="Salvando..."
          isPending={isSubmitting}
          onCancel={isEditing ? onCancel : undefined}
          error={errors.root?.server?.message}
          errorId="transaction-form-error"
        />
      </FieldGroup>
    </form>
  )
}
