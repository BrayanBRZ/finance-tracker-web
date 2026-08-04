import { useState } from 'react'
import { Plus } from 'lucide-react'
import { CategoryForm } from '@/components/categories/CategoryForm'
import { CategoryList } from '@/components/categories/CategoryList'
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog'
import { PageErrorState } from '@/components/feedback/PageErrorState'
import { PageLoader } from '@/components/feedback/PageLoader'
import { FormDialog } from '@/components/form-fields/FormDialog'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { useCategories } from '@/hooks/useCategories'
import { useToast } from '@/hooks/useToast'

const getErrorMessage = (error) =>
  error instanceof Error
    ? error.message
    : 'Não foi possível concluir a operação.'

function CategoriesContent() {
  const { toast } = useToast()
  const [editingCategory, setEditingCategory] = useState(null)
  const [deletingCategory, setDeletingCategory] = useState(null)
  const [isDeletePending, setIsDeletePending] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const {
    createCategory,
    appearanceOptions,
    errorMessage,
    groupedCategories,
    isLoading,
    refreshCategories,
    updateCategory,
    removeCategory,
  } = useCategories()

  const saveCategory = async (categoryData) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryData)
        toast({
          message: 'Categoria atualizada com sucesso.',
          variant: 'success',
        })
        setEditingCategory(null)
        setIsFormOpen(false)
        return
      }

      await createCategory(categoryData)
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
      await removeCategory(deletingCategory.id)
      toast({ message: 'Categoria excluída com sucesso.', variant: 'success' })
      if (editingCategory?.id === deletingCategory.id) setEditingCategory(null)
      setDeletingCategory(null)
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
      <CategoryList
        className="min-h-0 flex-1"
        groupedCategories={groupedCategories}
        canManage
        onEdit={openEditForm}
        onRemove={setDeletingCategory}
      />

      <FormDialog
        open={isFormOpen}
        onOpenChange={handleFormOpenChange}
        title={editingCategory ? 'Editar categoria' : 'Nova categoria'}
        description="Categorias são pessoais e podem classificar lançamentos das suas carteiras."
      >
        <CategoryForm
          appearanceOptions={appearanceOptions}
          category={editingCategory}
          onSubmit={saveCategory}
          onCancel={() => handleFormOpenChange(false)}
        />
      </FormDialog>

      <ConfirmDialog
        open={Boolean(deletingCategory)}
        onOpenChange={(isOpen) => {
          if (!isOpen && !isDeletePending) setDeletingCategory(null)
        }}
        title="Excluir categoria"
        description={`A categoria “${deletingCategory?.name ?? ''}” será removida permanentemente.`}
        confirmLabel="Excluir categoria"
        isPending={isDeletePending}
        onConfirm={confirmDeleteCategory}
      />
    </div>
  )
}

export function CategoriesPage() {
  return <CategoriesContent />
}
