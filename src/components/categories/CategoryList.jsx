import { Tags } from 'lucide-react'
import { CategoryTypeBadge } from '@/components/categories/CategoryTypeBadge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FINANCIAL_TYPE_LABELS, FINANCIAL_TYPES } from '@/domain/financialTypes'
import { cn } from '@/lib/utils'

const categorySections = [
  {
    type: FINANCIAL_TYPES.EXPENSE,
    title: 'Despesas',
    description: 'Categorias usadas para classificar saídas da carteira.',
    emptyMessage: 'Nenhuma categoria de despesa cadastrada.',
  },
  {
    type: FINANCIAL_TYPES.INCOME,
    title: 'Receitas',
    description: 'Categorias usadas para classificar entradas da carteira.',
    emptyMessage: 'Nenhuma categoria de receita cadastrada.',
  },
]

function CategoryItem({ category }) {
  return (
    <li className="border-border bg-card rounded-xl border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
              <Tags className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-card-foreground truncate font-medium">
                {category.name}
              </p>
              <p className="text-muted-foreground text-xs">
                {FINANCIAL_TYPE_LABELS[category.type]}
              </p>
            </div>
          </div>
        </div>

        <CategoryTypeBadge type={category.type} />
      </div>

      {category.icon || category.color ? (
        <dl className="text-muted-foreground mt-4 grid gap-2 text-xs sm:grid-cols-2">
          {category.icon ? (
            <div>
              <dt className="text-foreground font-medium">Ícone</dt>
              <dd>{category.icon}</dd>
            </div>
          ) : null}

          {category.color ? (
            <div>
              <dt className="text-foreground font-medium">Cor</dt>
              <dd>{category.color}</dd>
            </div>
          ) : null}
        </dl>
      ) : null}
    </li>
  )
}

function CategorySection({ section, categories }) {
  return (
    <section className="space-y-3">
      <div>
        <h3 className="font-heading text-foreground text-lg font-medium">
          {section.title}
        </h3>
        <p className="text-muted-foreground text-sm">{section.description}</p>
      </div>

      {categories.length > 0 ? (
        <ul className="grid gap-3">
          {categories.map((category) => (
            <CategoryItem key={category.id} category={category} />
          ))}
        </ul>
      ) : (
        <div className="border-border bg-muted/40 text-muted-foreground rounded-xl border border-dashed p-4 text-sm">
          {section.emptyMessage}
        </div>
      )}
    </section>
  )
}

export function CategoryList({ groupedCategories, hasCategories, className }) {
  return (
    <Card className={cn('p-4', className)}>
      <CardHeader>
        <p className="text-primary text-sm font-medium">
          Categorias cadastradas
        </p>
        <CardTitle className="text-2xl">Organização financeira</CardTitle>
        <CardDescription>
          Separe receitas e despesas para preparar os lançamentos futuros.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {!hasCategories ? (
          <div className="border-border bg-muted/40 text-muted-foreground rounded-xl border border-dashed p-5 text-sm">
            Nenhuma categoria cadastrada para esta carteira.
          </div>
        ) : null}

        {categorySections.map((section) => (
          <CategorySection
            key={section.type}
            section={section}
            categories={
              section.type === FINANCIAL_TYPES.INCOME
                ? groupedCategories.income
                : groupedCategories.expense
            }
          />
        ))}
      </CardContent>
    </Card>
  )
}
