import { AuthPasswordStrengthIndicator } from '@/components/auth/form/AuthPasswordStrengthIndicator'
import { ErrorSpan } from '@/components/form-fields/ErrorSpan'
import { PasswordField } from '@/components/form-fields/PasswordField'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'
import { useChangePasswordForm } from '@/hooks/useChangePasswordForm'

export function ChangePasswordForm() {
  const { form, newPassword, successMessage, onSubmit } =
    useChangePasswordForm()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
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
          labelAddon={
            <AuthPasswordStrengthIndicator password={newPassword ?? ''} />
          }
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
          <p role="status" className="text-primary text-sm">
            {successMessage}
          </p>
        ) : null}
      </FieldGroup>
    </form>
  )
}
