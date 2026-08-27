import { CollectionEmptyState } from '@/components/collections/CollectionEmptyState'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
    <Table
      containerClassName={cn(
        'scrollbar-minimal min-h-0 overflow-auto ring-1 ring-border',
        className,
      )}
      className={tableClassName}
    >
      <TableHeader className="bg-muted/95 text-muted-foreground sticky top-0 z-10 text-xs backdrop-blur-sm">
        <TableRow className="hover:bg-transparent">
          {columns.map((column) => (
            <TableHead
              key={column.key}
              scope="col"
              className={cn(
                'text-muted-foreground h-9 px-3 text-xs',
                column.headerClassName,
              )}
            >
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={getItemKey(item)} className="hover:bg-muted/35">
            {columns.map((column) => (
              <TableCell
                key={column.key}
                className={cn('px-3 py-2.5', column.cellClassName)}
              >
                {column.render(item)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
