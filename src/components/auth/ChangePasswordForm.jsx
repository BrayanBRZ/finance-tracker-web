import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthPasswordStrengthIndicator } from '@/components/auth/form/AuthPasswordStrengthIndicator'
import { ErrorSpan } from '@/components/forms/ErrorSpan'
import { PasswordField } from '@/components/forms/PasswordField'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'
import { changePasswordSchema } from '@/schemas/changePasswordSchema'
import { changePassword } from '@/services/authService'
import { useSession } from '@/context/sessionContext'

export function ChangePasswordForm() {
  const { session } = useSession()
  const [successMessage, setSuccessMessage] = useState(null)
  const form = useForm({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onTouched',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = form
  const newPassword = useWatch({ control, name: 'newPassword' })

  const submit = async ({ currentPassword, newPassword }) => {
    try {
      form.clearErrors('root')
      const response = await changePassword({
        userId: session?.user.id,
        currentPassword,
        newPassword,
      })
      reset()
      setSuccessMessage(response.message)
    } catch (error) {
      setSuccessMessage(null)
      form.setError('root.server', {
        type: 'server',
        message: error instanceof Error ? error.message : 'Não foi possível alterar a senha.',
      })
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit(submit)}>
      <FieldGroup className="gap-4">
        <PasswordField
          id="current-password"
          label="Senha atual"
          autoComplete="current-password"
          {...register('currentPassword')}
          disabled={isSubmitting}
          error={errors.currentPassword?.message}
        />
        <PasswordField
          id="new-password"
          label="Nova senha"
          autoComplete="new-password"
          {...register('newPassword')}
          disabled={isSubmitting}
          error={errors.newPassword?.message}
          labelAddon={<AuthPasswordStrengthIndicator password={newPassword ?? ''} />}
        />
        <PasswordField
          id="new-password-confirmation"
          label="Confirmar nova senha"
          autoComplete="new-password"
          {...register('confirmPassword')}
          disabled={isSubmitting}
          error={errors.confirmPassword?.message}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Alterando...' : 'Alterar senha'}
        </Button>
        <ErrorSpan
          id="change-password-error"
          error={errors.root?.server?.message}
          className="text-sm"
        />
        {successMessage ? (
          <p role="status" className="text-sm text-primary">
            {successMessage}
          </p>
        ) : null}
      </FieldGroup>
    </form>
  )
}
