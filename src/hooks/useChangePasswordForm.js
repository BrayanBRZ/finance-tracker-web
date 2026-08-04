import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from '@/context/sessionContext'
import { changePasswordSchema } from '@/schemas/changePasswordSchema'
import { changePassword } from '@/services/authService'
import { getErrorMessage } from '@/utils/errors'

export function useChangePasswordForm() {
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
  const newPassword = useWatch({ control: form.control, name: 'newPassword' })

  const onSubmit = async ({ currentPassword, newPassword }) => {
    try {
      form.clearErrors()
      const response = await changePassword({
        userId: session?.user.id,
        currentPassword,
        newPassword,
      })
      form.reset()
      setSuccessMessage(response.message)
    } catch (error) {
      setSuccessMessage(null)

      if (error instanceof Error && error.field === 'currentPassword') {
        form.setError('currentPassword', {
          type: 'server',
          message: error.message,
        })
        return
      }

      form.setError('root.server', {
        type: 'server',
        message: getErrorMessage(error, 'Não foi possível alterar a senha.'),
      })
    }
  }

  return { form, newPassword, successMessage, onSubmit }
}
