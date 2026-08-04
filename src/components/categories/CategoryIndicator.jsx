import {
  BriefcaseBusiness,
  Car,
  ChartNoAxesCombined,
  Gamepad2,
  Gift,
  GraduationCap,
  HeartPulse,
  House,
  ReceiptText,
  ShoppingBag,
  Tags,
  Utensils,
  Wallet,
} from 'lucide-react'
import { getCategoryColor } from '@/lib/categoryAppearance'
import { cn } from '@/lib/utils'

const categoryIcons = {
  wallet: Wallet,
  utensils: Utensils,
  car: Car,
  house: House,
  'heart-pulse': HeartPulse,
  'graduation-cap': GraduationCap,
  'gamepad-2': Gamepad2,
  'receipt-text': ReceiptText,
  'briefcase-business': BriefcaseBusiness,
  'chart-no-axes-combined': ChartNoAxesCombined,
  gift: Gift,
  'shopping-bag': ShoppingBag,
}

export function CategoryIcon({ icon, color, className, iconClassName }) {
  const Icon = categoryIcons[icon] ?? Tags
  const resolvedColor = getCategoryColor(color)

  return (
    <span
      className={cn(
        'flex size-7 shrink-0 items-center justify-center rounded-(--radius)',
        className,
      )}
      style={{
        color: resolvedColor,
        backgroundColor: `color-mix(in srgb, ${resolvedColor} 14%, transparent)`,
      }}
    >
      <Icon className={cn('size-4', iconClassName)} aria-hidden="true" />
    </span>
  )
}

export function CategoryIndicator({ category, className, iconClassName }) {
  return (
    <span className={cn('inline-flex min-w-0 items-center gap-2', className)}>
      <CategoryIcon
        icon={category?.icon}
        color={category?.color}
        iconClassName={iconClassName}
      />
      <span className="truncate">{category?.name ?? 'Sem categoria'}</span>
    </span>
  )
}
