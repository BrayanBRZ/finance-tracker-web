import { Plus } from 'lucide-react'
import { CategoryForm } from '@/components/categories/CategoryForm'
import { CategoryList } from '@/components/categories/CategoryList'
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog'
import { PageErrorState } from '@/components/feedback/PageErrorState'
import { PageLoader } from '@/components/feedback/PageLoader'
import { FormDialog } from '@/components/form-fields/FormDialog'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { useCategoriesPage } from '@/hooks/category/useCategoriesPage'

function CategoriesContent() {
  const {
    appearanceOptions,
    groupedCategories,
    isLoading,
    errorMessage,
    refreshCategories,
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
  } = useCategoriesPage()

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
        onOpenChange={handleDeleteOpenChange}
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
