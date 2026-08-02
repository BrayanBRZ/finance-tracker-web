import { useState } from 'react'
import { CategoryForm } from '@/components/categories/CategoryForm'
import { CategoryList } from '@/components/categories/CategoryList'
import { StateCard } from '@/components/feedback/StateCard'
import { ContentWithAside } from '@/components/layout/ContentWithAside'
import { useCategories } from '@/hooks/useCategories'

function CategoriesContent() {
  const [editingCategory, setEditingCategory] = useState(null)
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
      return
    }

    await createCategory(categoryData)
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

  if (isLoading) {
    return (
      <StateCard
        eyebrow="Carregando categorias"
        title="Buscando suas categorias"
        description="Estamos preparando suas categorias de receitas e despesas."
        role="status"
        ariaLive="polite"
      />
    )
  }

  if (errorMessage) {
    return (
      <StateCard
        eyebrow="Não foi possível carregar categorias"
        title="Algo saiu do trilho"
        description={errorMessage}
        role="alert"
        action={{ label: 'Tentar novamente', onClick: () => void refreshCategories() }}
      />
    )
  }

  return (
    <ContentWithAside>
      <div className="space-y-4">
        {operationError ? (
          <p role="alert" className="rounded-(--radius) border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {operationError}
          </p>
        ) : null}
        <CategoryList
          groupedCategories={groupedCategories}
          hasCategories={hasCategories}
          canManage
          onEdit={setEditingCategory}
          onRemove={deleteCategory}
        />
      </div>
      <CategoryForm
        category={editingCategory}
        onSubmit={saveCategory}
        onCancel={() => setEditingCategory(null)}
      />
    </ContentWithAside>
  )
}

export function CategoriesPage() {
  return <CategoriesContent />
}
