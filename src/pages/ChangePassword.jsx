import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ChangePasswordForm } from '@/components/auth/ChangePasswordForm'

export function ChangePasswordPage() {
  return (
    <div className="mx-auto max-w-md space-y-2">
      <p className="text-sm font-medium text-primary">Perfil</p>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Alterar senha</CardTitle>
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
