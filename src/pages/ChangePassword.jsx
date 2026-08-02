import { useState } from 'react'
import { KeyRound } from 'lucide-react'
import { ChangePasswordForm } from '@/components/auth/ChangePasswordForm'
import { FormDialog } from '@/components/forms/FormDialog'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'

export function ChangePasswordPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)

  return (
    <div className="flex h-full min-h-0 flex-col gap-6">
      <PageHeader
        title="Alterar senha"
        description="Atualize as credenciais de acesso da sua conta."
        actions={
          <Button type="button" onClick={() => setIsFormOpen(true)}>
            <KeyRound aria-hidden="true" />
            Alterar senha
          </Button>
        }
      />

      <FormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        title="Nova senha"
        description="Confirme sua senha atual antes de escolher uma nova."
      >
        <ChangePasswordForm />
      </FormDialog>
    </div>
  )
}
