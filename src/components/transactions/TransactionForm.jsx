import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { ErrorSpan } from '@/components/forms/ErrorSpan'
import { TextField } from '@/components/forms/TextField'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  const filteredCategories = categories.filter(
    (category) => category.type === selectedType,
  )

  const changeTransactionType = (field, nextType) => {
    field.onChange(nextType)

    const selectedCategoryId = getValues('categoryId')
    const selectedCategory = categories.find(
      (category) => category.id === selectedCategoryId,
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
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="transaction-type">Tipo</FieldLabel>
              <Select
                value={field.value}
                onValueChange={(nextType) =>
                  changeTransactionType(field, nextType)
                }
                onOpenChange={(isOpen) => {
                  if (!isOpen) field.onBlur()
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger
                  id="transaction-type"
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
              <ErrorSpan
                id="transaction-type-error"
                error={errors.type?.message}
              />
            </Field>
          )}
        />
        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="transaction-category">Categoria</FieldLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                onOpenChange={(isOpen) => {
                  if (!isOpen) field.onBlur()
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger
                  id="transaction-category"
                  aria-invalid={errors.categoryId ? true : undefined}
                >
                  <SelectValue placeholder="Sem categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_CATEGORY_VALUE}>
                    Sem categoria
                  </SelectItem>
                  {filteredCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <ErrorSpan
                id="transaction-category-error"
                error={errors.categoryId?.message}
              />
            </Field>
          )}
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
        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? 'Salvando...'
              : isEditing
                ? 'Salvar alterações'
                : 'Registrar transação'}
          </Button>
          {isEditing ? (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          ) : null}
        </div>
        <ErrorSpan
          id="transaction-form-error"
          error={errors.root?.server?.message}
          className="text-sm"
        />
      </FieldGroup>
    </form>
  )
}
