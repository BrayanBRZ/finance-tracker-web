import { createLocalStorageCollection } from '@/mocks/data/createLocalStorageCollection'
import { readWallets } from '@/mocks/data/walletData'
import { isSameId } from '@/mocks/utils/id'

const CATEGORIES_STORAGE_KEY = '@project:categories_data'

const mockCategories = [
  {
    id: 'category-salary',
    userId: '1',
    name: 'Salário',
    type: 'INCOME',
    color: '#16a34a',
    icon: 'wallet',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'category-food',
    userId: '1',
    name: 'Alimentação',
    type: 'EXPENSE',
    color: '#f97316',
    icon: 'utensils',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'category-transport',
    userId: '1',
    name: 'Transporte',
    type: 'EXPENSE',
    color: '#2563eb',
    icon: 'car',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'category-freelance',
    userId: '1',
    name: 'Freelance',
    type: 'INCOME',
    color: '#0891b2',
    icon: 'briefcase-business',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'category-investments',
    userId: '1',
    name: 'Investimentos',
    type: 'INCOME',
    color: '#9333ea',
    icon: 'chart-no-axes-combined',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'category-bonus',
    userId: '1',
    name: 'Bônus',
    type: 'INCOME',
    color: '#ca8a04',
    icon: 'gift',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'category-sales',
    userId: '1',
    name: 'Vendas',
    type: 'INCOME',
    color: '#db2777',
    icon: 'shopping-bag',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'category-refunds',
    userId: '1',
    name: 'Reembolsos',
    type: 'INCOME',
    color: '#2563eb',
    icon: 'receipt-text',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'category-rental-income',
    userId: '1',
    name: 'Aluguel recebido',
    type: 'INCOME',
    color: '#16a34a',
    icon: 'house',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'category-housing',
    userId: '1',
    name: 'Moradia',
    type: 'EXPENSE',
    color: '#9333ea',
    icon: 'house',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'category-health',
    userId: '1',
    name: 'Saúde',
    type: 'EXPENSE',
    color: '#dc2626',
    icon: 'heart-pulse',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'category-education',
    userId: '1',
    name: 'Educação',
    type: 'EXPENSE',
    color: '#2563eb',
    icon: 'graduation-cap',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'category-leisure',
    userId: '1',
    name: 'Lazer',
    type: 'EXPENSE',
    color: '#db2777',
    icon: 'gamepad-2',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'category-subscriptions',
    userId: '1',
    name: 'Assinaturas',
    type: 'EXPENSE',
    color: '#0891b2',
    icon: 'receipt-text',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'category-client-payments',
    userId: '2',
    name: 'Pagamentos de clientes',
    type: 'INCOME',
    color: '#16a34a',
    icon: 'briefcase-business',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'category-services',
    userId: '2',
    name: 'Serviços',
    type: 'INCOME',
    color: '#0891b2',
    icon: 'wallet',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'category-tools',
    userId: '2',
    name: 'Ferramentas',
    type: 'EXPENSE',
    color: '#f97316',
    icon: 'shopping-bag',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'category-taxes',
    userId: '2',
    name: 'Impostos',
    type: 'EXPENSE',
    color: '#dc2626',
    icon: 'receipt-text',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
]

const categoryCollection = createLocalStorageCollection({
  storageKey: CATEGORIES_STORAGE_KEY,
  initialData: mockCategories,
})

const migrateLegacyCategories = (categories) => {
  const wallets = readWallets()
  let hasChanges = false

  const migratedCategories = categories.map((category) => {
    if (category.userId || !category.walletId) return category

    const wallet = wallets.find((candidate) =>
      isSameId(candidate.id, category.walletId),
    )

    if (!wallet?.createdById) return category

    hasChanges = true
    const categoryData = { ...category }
    delete categoryData.walletId

    return { ...categoryData, userId: wallet.createdById }
  })

  return { categories: migratedCategories, hasChanges }
}

export function readCategories() {
  const { categories, hasChanges } = migrateLegacyCategories(
    categoryCollection.read(),
  )

  if (hasChanges) categoryCollection.write(categories)

  return categories
}

export const writeCategories = categoryCollection.write
