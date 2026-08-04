import { CollectionEmptyState } from '@/components/collections/CollectionEmptyState'
import { cn } from '@/lib/utils'

export function DataTable({
  items,
  columns,
  getItemKey,
  emptyMessage,
  className,
  tableClassName,
}) {
  if (items.length === 0) {
    return <CollectionEmptyState>{emptyMessage}</CollectionEmptyState>
  }

  return (
    <div
      className={cn(
        'scrollbar-minimal min-h-0 overflow-auto ring-1 ring-border',
        className,
      )}
    >
      <table className={cn('w-full border-collapse text-sm', tableClassName)}>
        <thead className="sticky top-0 z-10 bg-muted/95 text-left text-xs text-muted-foreground backdrop-blur-sm">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cn(
                  'h-9 px-3 font-medium whitespace-nowrap',
                  column.headerClassName,
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((item) => (
            <tr key={getItemKey(item)} className="hover:bg-muted/35">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn('px-3 py-2.5 align-middle', column.cellClassName)}
                >
                  {column.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
