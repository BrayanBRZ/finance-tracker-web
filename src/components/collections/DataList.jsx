import { CollectionEmptyState } from '@/components/collections/CollectionEmptyState'
import { cn } from '@/lib/utils'

export function DataList({
  items,
  getItemKey,
  renderItem,
  emptyMessage,
  compact = false,
  scrollable = false,
  className,
  itemClassName,
}) {
  if (items.length === 0) {
    return <CollectionEmptyState>{emptyMessage}</CollectionEmptyState>
  }

  return (
    <ul
      className={cn(
        'divide-y divide-border',
        scrollable && 'scrollbar-minimal min-h-0 overflow-y-auto',
        className,
      )}
    >
      {items.map((item, index) => (
        <li
          key={getItemKey(item)}
          className={cn(compact ? 'py-2.5' : 'py-3', itemClassName)}
        >
          {renderItem(item, index)}
        </li>
      ))}
    </ul>
  )
}
