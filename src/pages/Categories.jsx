import { useState } from 'react'
import { CategoryForm } from '@/components/categories/CategoryForm'
import { CategoryList } from '@/components/categories/CategoryList'
import { StateCard } from '@/components/feedback/StateCard'
import { ContentWithAside } from '@/components/layout/ContentWithAside'
import { WalletScope } from '@/components/wallets/WalletScope'
import { useWallet } from '@/context/walletContext'
import { WALLET_MEMBER_ROLES } from '@/domain/walletRoles'
import { useCategories } from '@/hooks/useCategories'

function CategoryAccessCard() {
  return (
    <StateCard
      eyebrow="Permissão da carteira"
      title="Somente o proprietário pode gerenciar categorias"
      description="Você ainda pode visualizar as categorias desta carteira, mas não pode criar, editar ou excluir registros."
      role="status"
      ariaLive="polite"
    />
  )
}

function CategoriesContent() {
  const { currentWallet } = useWallet()
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
  const canManageCategories = currentWallet?.role === WALLET_MEMBER_ROLES.OWNER

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
      if (editingCategory?.id === categoryId) {
        setEditingCategory(null)
      }
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
        title="Buscando categorias da carteira..."
        description="Estamos preparando receitas e despesas da carteira atual."
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
          <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {operationError}
          </p>
        ) : null}
        <CategoryList
          groupedCategories={groupedCategories}
          hasCategories={hasCategories}
          canManage={canManageCategories}
          onEdit={setEditingCategory}
          onRemove={deleteCategory}
        />
      </div>
      {canManageCategories ? (
        <CategoryForm
          category={editingCategory}
          onSubmit={saveCategory}
          onCancel={() => setEditingCategory(null)}
        />
      ) : (
        <CategoryAccessCard />
      )}
    </ContentWithAside>
  )
}

export function CategoriesPage() {
  return (
    <WalletScope>
      <CategoriesContent />
    </WalletScope>
  )
}
