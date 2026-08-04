import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function StateCard({
  eyebrow,
  title,
  description,
  action,
  role,
  ariaLive,
}) {
  return (
    <Card role={role} aria-live={ariaLive}>
      <CardHeader>
        {eyebrow ? (
          <p className="text-primary text-sm font-medium">{eyebrow}</p>
        ) : null}
        <CardTitle className="text-3xl">{title}</CardTitle>
      </CardHeader>

      <CardContent>
        {description ? (
          <p className="text-muted-foreground max-w-2xl">{description}</p>
        ) : null}

        {action ? (
          <Button type="button" onClick={action.onClick} className="mt-6">
            {action.label}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  )
}
