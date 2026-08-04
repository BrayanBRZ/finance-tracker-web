import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function CollectionCard({
  title,
  description,
  eyebrow,
  actions,
  children,
  className,
  contentClassName,
}) {
  return (
    <Card className={cn('min-h-0', className)}>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            {eyebrow ? (
              <p className="text-sm font-medium text-primary">{eyebrow}</p>
            ) : null}
            <CardTitle>{title}</CardTitle>
            {description ? (
              <CardDescription>{description}</CardDescription>
            ) : null}
          </div>
          {actions ? (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className={cn('min-h-0', contentClassName)}>
        {children}
      </CardContent>
    </Card>
  )
}
