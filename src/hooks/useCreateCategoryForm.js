import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FINANCIAL_TYPES } from '@/domain/financialTypes'
import { categorySchema } from '@/schemas/categorySchema'

export function useCreateCategoryForm({ createCategory }) {
  const form = useForm({
    resolver: zodResolver(categorySchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      type: FINANCIAL_TYPES.EXPENSE,
      color: '',
      icon: '',
    },
  })

  const onSubmit = async (categoryData) => {
    try {
      form.clearErrors('root')
      await createCategory(categoryData)
      form.reset({
        name: '',
        type: categoryData.type,
        color: '',
        icon: '',
      })
    } catch (error) {
      form.setError('root.server', {
        type: 'server',
        message:
          error instanceof Error
            ? error.message
            : 'Não foi possível criar a categoria.',
      })
    }
  }

  return {
    form,
    onSubmit,
  }
}
