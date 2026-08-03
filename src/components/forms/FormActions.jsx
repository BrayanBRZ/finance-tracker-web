import { Button } from '@/components/ui/button'
import { ErrorSpan } from '@/components/forms/ErrorSpan'

export function FormActions({
  submitLabel,
  pendingLabel,
  isPending,
  onCancel,
  error,
  errorId,
}) {
  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? pendingLabel : submitLabel}
        </Button>
        {onCancel ? (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancelar
          </Button>
        ) : null}
      </div>
      <ErrorSpan id={errorId} error={error} className="text-sm" />
    </>
  )
}
