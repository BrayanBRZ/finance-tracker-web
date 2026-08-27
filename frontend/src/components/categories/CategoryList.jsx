import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CategoryIndicator } from '@/components/categories/CategoryIndicator'
import { CollectionCard } from '@/components/collections/CollectionCard'
import { DataTable } from '@/components/collections/DataTable'
import { FINANCIAL_TYPES } from '@/domain/financialTypes'
import { cn } from '@/lib/utils'

const categorySections = [
  {
    type: FINANCIAL_TYPES.EXPENSE,
    title: 'Despesas',
    description: 'Categorias pessoais para classificar suas despesas.',
    emptyMessage: 'Nenhuma categoria de despesa cadastrada.',
  },
  {
    type: FINANCIAL_TYPES.INCOME,
    title: 'Receitas',
    description: 'Categorias pessoais para classificar suas receitas.',
    emptyMessage: 'Nenhuma categoria de receita cadastrada.',
  },
]

function CategorySection({ section, categories, canManage, onEdit, onRemove }) {
  const columns = [
    {
      key: 'category',
      header: 'Categoria',
      render: (category) => (
        <CategoryIndicator
          category={category}
          className="text-card-foreground min-w-0 font-medium"
        />
      ),
    },
    {
      key: 'actions',
      header: 'Ações',
      headerClassName: 'w-40 text-right',
      cellClassName: 'w-40 whitespace-nowrap text-right',
      render: (category) =>
        canManage ? (
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onEdit(category)}
            >
              <Pencil aria-hidden="true" />
              Editar
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => onRemove(category)}
            >
              <Trash2 aria-hidden="true" />
              Excluir
            </Button>
          </div>
        ) : null,
    },
  ]

  return (
    <CollectionCard
      className="h-full"
      contentClassName="flex min-h-0 flex-1 flex-col border-(--radius)"
      title={section.title}
      description={section.description}
    >
      <DataTable
        items={categories}
        columns={columns}
        getItemKey={(category) => category.id}
        emptyMessage={section.emptyMessage}
        className="h-full flex-1"
      />
    </CollectionCard>
  )
}

export function CategoryList({
  groupedCategories,
  canManage,
  onEdit,
  onRemove,
  className,
}) {
  return (
    <div
      className={cn(
        'grid min-h-0 grid-rows-2 gap-4 lg:grid-cols-2 lg:grid-rows-1',
        className,
      )}
    >
      {categorySections.map((section) => (
        <CategorySection
          key={section.type}
          section={section}
          categories={
            section.type === FINANCIAL_TYPES.INCOME
              ? groupedCategories.income
              : groupedCategories.expense
          }
          canManage={canManage}
          onEdit={onEdit}
          onRemove={onRemove}
        />
      ))}
    </div>
  )
}
