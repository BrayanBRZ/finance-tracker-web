import { useState } from 'react'
import { Plus } from 'lucide-react'
import { CategoryForm } from '@/components/categories/CategoryForm'
import { CategoryList } from '@/components/categories/CategoryList'
import { FormDialog } from '@/components/forms/FormDialog'
import { PageErrorState } from '@/components/feedback/PageErrorState'
import { PageLoader } from '@/components/feedback/PageLoader'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { useCategories } from '@/hooks/useCategories'

function CategoriesContent() {
  const [editingCategory, setEditingCategory] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [operationError, setOperationError] = useState(null)
  const {
    createCategory,
    errorMessage,
    groupedCategories,
    hasCategories,
    isLoading,
    refreshCategories,
    updateCategory,
    removeCategory,
  } = useCategories()

  const saveCategory = async (categoryData) => {
    setOperationError(null)

    if (editingCategory) {
      await updateCategory(editingCategory.id, categoryData)
      setEditingCategory(null)
      setIsFormOpen(false)
      return
    }

    await createCategory(categoryData)
    setIsFormOpen(false)
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

  const deleteCategory = async (categoryId) => {
    try {
      setOperationError(null)
      await removeCategory(categoryId)
      if (editingCategory?.id === categoryId) setEditingCategory(null)
    } catch (error) {
      setOperationError(
        error instanceof Error
          ? error.message
          : 'Não foi possível excluir a categoria.',
      )
    }
  }

  return isLoading ? (
    <PageLoader />
  ) : errorMessage ? (
    <PageErrorState
      eyebrow="Não foi possível carregar categorias"
      description={errorMessage}
      onRetry={() => void refreshCategories()}
    />
  ) : (
    <div className="flex h-full min-h-0 flex-col gap-6">
      <PageHeader
        title="Categorias"
        description="Organize categorias para classificar seus lançamentos."
        actions={
          <Button type="button" onClick={openCreateForm}>
            <Plus aria-hidden="true" />
            Nova categoria
          </Button>
        }
      />

      {operationError ? (
        <p
          role="alert"
          className="rounded-(--radius) border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {operationError}
        </p>
      ) : null}
      <CategoryList
        className="min-h-0 flex-1"
        groupedCategories={groupedCategories}
        hasCategories={hasCategories}
        canManage
        onEdit={openEditForm}
        onRemove={deleteCategory}
      />

      <FormDialog
        open={isFormOpen}
        onOpenChange={handleFormOpenChange}
        title={editingCategory ? 'Editar categoria' : 'Nova categoria'}
        description="Categorias são pessoais e podem classificar lançamentos das suas carteiras."
      >
        <CategoryForm
          category={editingCategory}
          onSubmit={saveCategory}
          onCancel={() => handleFormOpenChange(false)}
        />
      </FormDialog>
    </div>
  )
}

export function CategoriesPage() {
  return <CategoriesContent />
}
