import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ChangePasswordForm } from '@/components/auth/ChangePasswordForm'
import { PageHeader } from '@/components/layout/PageHeader'

export function ChangePasswordPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Alterar senha"
        description="Atualize as credenciais de acesso da sua conta."
      />
      <div className="mx-auto max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Nova senha</CardTitle>
            <CardDescription>
              Confirme sua senha atual antes de escolher uma nova.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
