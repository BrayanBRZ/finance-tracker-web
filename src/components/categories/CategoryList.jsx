import { Pencil, Tags, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
    <li className="rounded-(--radius) border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-(--radius) bg-primary/10 text-primary">
              <Tags className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="truncate font-medium text-card-foreground">{category.name}</p>
              <p className="text-xs text-muted-foreground">
                {FINANCIAL_TYPE_LABELS[category.type]}
              </p>
            </div>
          </div>
        </div>
        <CategoryTypeBadge type={category.type} />
      </div>
      {category.icon || category.color ? (
        <dl className="mt-4 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
          {category.icon ? (
            <div><dt className="font-medium text-foreground">Ícone</dt><dd>{category.icon}</dd></div>
          ) : null}
          {category.color ? (
            <div><dt className="font-medium text-foreground">Cor</dt><dd>{category.color}</dd></div>
          ) : null}
        </dl>
      ) : null}
      {canManage ? (
        <div className="mt-4 flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => onEdit(category)}>
            <Pencil aria-hidden="true" /> Editar
          </Button>
          <Button type="button" variant="destructive" size="sm" onClick={() => void onRemove(category.id)}>
            <Trash2 aria-hidden="true" /> Excluir
          </Button>
        </div>
      ) : null}
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
      <CardContent className="space-y-6">
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
