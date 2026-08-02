import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CategoryIndicator } from '@/components/categories/CategoryIndicator'
import { CollectionCard } from '@/components/collections/CollectionCard'
import { DataList } from '@/components/collections/DataList'
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

function CategoryItem({ category, canManage, onEdit, onRemove }) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3 px-1">
      <CategoryIndicator
        category={category}
        className="min-w-0 font-medium text-card-foreground"
      />
      <div className="flex shrink-0 items-center gap-2">
        {canManage ? (
          <>
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
              onClick={() => void onRemove(category.id)}
            >
              <Trash2 aria-hidden="true" />
              Excluir
            </Button>
          </>
        ) : null}
      </div>
    </div>
  )
}

function CategorySection({ section, categories, canManage, onEdit, onRemove }) {
  return (
    <CollectionCard
      className="h-full"
      contentClassName="flex min-h-0 flex-1 flex-col"
      eyebrow={`${categories.length} ${
        categories.length === 1 ? 'categoria' : 'categorias'
      }`}
      title={section.title}
      description={section.description}
    >
      <DataList
        items={categories}
        getItemKey={(category) => category.id}
        renderItem={(category) => (
          <CategoryItem
            category={category}
            canManage={canManage}
            onEdit={onEdit}
            onRemove={onRemove}
          />
        )}
        emptyMessage={section.emptyMessage}
        compact
        scrollable
        className="h-full px-2 ring-1 ring-border"
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
