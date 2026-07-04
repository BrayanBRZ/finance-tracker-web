import { CreateCategoryForm } from '@/components/categories/CreateCategoryForm'
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
      title="Somente o proprietário pode criar categorias"
      description="Você ainda pode visualizar as categorias desta carteira, mas a criação fica restrita ao proprietário."
      role="status"
      ariaLive="polite"
    />
  )
}

function CategoriesContent() {
  const { currentWallet } = useWallet()
  const {
    createCategory,
    errorMessage,
    groupedCategories,
    hasCategories,
    isLoading,
    refreshCategories,
  } = useCategories()
  const canManageCategories =
    currentWallet?.role === WALLET_MEMBER_ROLES.OWNER

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
        action={{
          label: 'Tentar novamente',
          onClick: () => void refreshCategories(),
        }}
      />
    )
  }

  return (
    <ContentWithAside>
      <CategoryList
        groupedCategories={groupedCategories}
        hasCategories={hasCategories}
      />

      {canManageCategories ? (
        <CreateCategoryForm createCategory={createCategory} />
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
