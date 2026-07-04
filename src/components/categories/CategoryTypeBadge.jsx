import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import { FINANCIAL_TYPE_LABELS, FINANCIAL_TYPES } from '@/domain/financialTypes'
import { cn } from '@/lib/utils'

const typeIcon = {
  [FINANCIAL_TYPES.INCOME]: ArrowUpCircle,
  [FINANCIAL_TYPES.EXPENSE]: ArrowDownCircle,
}

export function CategoryTypeBadge({ type, className }) {
  const Icon = typeIcon[type] ?? ArrowDownCircle

  return (
    <span
      className={cn(
        'bg-muted text-muted-foreground ring-border inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1',
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {FINANCIAL_TYPE_LABELS[type] ?? 'Categoria'}
    </span>
  )
}
