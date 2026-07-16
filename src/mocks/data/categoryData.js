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
