import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CategoryIndicator } from '@/components/categories/CategoryIndicator'
import { CategoryTypeBadge } from '@/components/categories/CategoryTypeBadge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  FINANCIAL_TYPE_LABELS,
  FINANCIAL_TYPES,
} from '@/domain/financialTypes'

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
    <li className="rounded-(--radius) border border-border bg-card p-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <CategoryIndicator
            category={category}
            className="font-medium text-card-foreground"
          />
          <p className="mt-1 pl-9 text-xs text-muted-foreground">
            Categoria de {FINANCIAL_TYPE_LABELS[category.type].toLowerCase()}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <CategoryTypeBadge type={category.type} />
          {canManage ? (
            <>
              <Button type="button" variant="outline" size="sm" onClick={() => onEdit(category)}>
                <Pencil aria-hidden="true" /> Editar
              </Button>
              <Button type="button" variant="destructive" size="sm" onClick={() => void onRemove(category.id)}>
                <Trash2 aria-hidden="true" /> Excluir
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </li>
  )
}

function CategorySection({ section, categories, canManage, onEdit, onRemove }) {
  return (
    <section className="space-y-3">
      <div>
        <h3 className="font-heading text-lg font-medium text-foreground">{section.title}</h3>
        <p className="text-sm text-muted-foreground">{section.description}</p>
      </div>
      {categories.length > 0 ? (
        <ul className="grid gap-3">
          {categories.map((category) => (
            <CategoryItem key={category.id} category={category} canManage={canManage} onEdit={onEdit} onRemove={onRemove} />
          ))}
        </ul>
      ) : (
        <div className="rounded-(--radius) border border-dashed border-border bg-muted/40 p-4 text-sm text-muted-foreground">
          {section.emptyMessage}
        </div>
      )}
    </section>
  )
}

export function CategoryList({ groupedCategories, hasCategories, canManage, onEdit, onRemove, className }) {
  return (
    <Card className={className}>
      <CardHeader>
        <p className="text-sm font-medium text-primary">Categorias cadastradas</p>
        <CardTitle className="text-2xl">Organização financeira</CardTitle>
        <CardDescription>Separe receitas e despesas para classificar os lançamentos.</CardDescription>
      </CardHeader>
      <CardContent className="scrollbar-minimal min-h-0 flex-1 space-y-5 overflow-y-auto">
        {!hasCategories ? (
          <div className="rounded-(--radius) border border-dashed border-border bg-muted/40 p-5 text-sm text-muted-foreground">
            Nenhuma categoria pessoal cadastrada.
          </div>
        ) : null}
        {categorySections.map((section) => (
          <CategorySection
            key={section.type}
            section={section}
            categories={section.type === FINANCIAL_TYPES.INCOME ? groupedCategories.income : groupedCategories.expense}
            canManage={canManage}
            onEdit={onEdit}
            onRemove={onRemove}
          />
        ))}
      </CardContent>
    </Card>
  )
}
