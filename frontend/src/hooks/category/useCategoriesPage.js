import { useState } from 'react'
import { useCategories } from '@/hooks/category/useCategories'
import { useToast } from '@/hooks/useToast'
import { getErrorMessage } from '@/utils/errors'

export function useCategoriesPage() {
  const { toast } = useToast()
  const [editingCategory, setEditingCategory] = useState(null)
  const [deletingCategory, setDeletingCategory] = useState(null)
  const [isDeletePending, setIsDeletePending] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const categoriesState = useCategories()

  const saveCategory = async (categoryData) => {
    try {
      if (editingCategory) {
        await categoriesState.updateCategory(editingCategory.id, categoryData)
        toast({ message: 'Categoria atualizada com sucesso.', variant: 'success' })
        setEditingCategory(null)
        setIsFormOpen(false)
        return
      }

      await categoriesState.createCategory(categoryData)
      toast({ message: 'Categoria criada com sucesso.', variant: 'success' })
      setIsFormOpen(false)
    } catch (error) {
      toast({ message: getErrorMessage(error), variant: 'error' })
      throw error
    }
  }

  const confirmDeleteCategory = async () => {
    if (!deletingCategory) return

    setIsDeletePending(true)
    try {
      await categoriesState.removeCategory(deletingCategory.id)
      toast({ message: 'Categoria excluída com sucesso.', variant: 'success' })
      if (editingCategory?.id === deletingCategory.id) setEditingCategory(null)
    } catch (error) {
      toast({ message: getErrorMessage(error), variant: 'error' })
    } finally {
      setIsDeletePending(false)
      setDeletingCategory(null)
    }
  }

  const openCreateForm = () => {
    setEditingCategory(null)
    setIsFormOpen(true)
  }
  const openEditForm = (category) => {
    setEditingCategory(category)
    setIsFormOpen(true)
  }
  const handleFormOpenChange = (isOpen) => {
    setIsFormOpen(isOpen)
    if (!isOpen) setEditingCategory(null)
  }
  const handleDeleteOpenChange = (isOpen) => {
    if (!isOpen && !isDeletePending) setDeletingCategory(null)
  }

  return {
    ...categoriesState,
    editingCategory,
    deletingCategory,
    isDeletePending,
    isFormOpen,
    saveCategory,
    confirmDeleteCategory,
    openCreateForm,
    openEditForm,
    setDeletingCategory,
    handleFormOpenChange,
    handleDeleteOpenChange,
  }
}
