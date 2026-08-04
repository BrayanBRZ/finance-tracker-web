import { ControlledSelectField } from '@/components/form-fields/ControlledSelectField'
import { FormActions } from '@/components/form-fields/FormActions'
import { TextField } from '@/components/form-fields/TextField'
import { FieldGroup } from '@/components/ui/field'
import { FINANCIAL_TYPE_OPTIONS } from '@/domain/financialTypes'
import { useTransactionForm } from '@/hooks/useTransactionForm'
import { toDateInputValue } from '@/utils/formatters'

export function TransactionForm({
  categories,
  transaction,
  onSubmit,
  onCancel,
}) {
  const {
    form,
    isEditing,
    categoryOptions,
    onTypeChange,
    onSubmit: submit,
  } = useTransactionForm({ categories, transaction, onSubmit })
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

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
          onValueChange={(nextType, field) => onTypeChange(field, nextType)}
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
            max={toDateInputValue()}
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
