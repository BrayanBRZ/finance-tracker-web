import { ChangePasswordForm } from '@/components/auth/ChangePasswordForm'
import { PageHeader } from '@/components/layout/PageHeader'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function ChangePasswordPage() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-6">
      <PageHeader
        title="Alterar senha"
        description="Atualize sua senha de acesso com segurança."
      />

      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Segurança da conta</CardTitle>
          <CardDescription>
            Confirme sua senha atual antes de escolher uma nova.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </div>
  )
}
