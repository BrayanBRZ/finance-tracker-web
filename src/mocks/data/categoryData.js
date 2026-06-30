import { createLocalStorageCollection } from '@/mocks/data/createLocalStorageCollection'

const CATEGORIES_STORAGE_KEY = '@project:categories_data'

const mockCategories = [
  {
    id: 'category-salary',
    walletId: 'wallet-personal',
    name: 'Salário',
    type: 'INCOME',
    color: '#16a34a',
    icon: 'wallet',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'category-food',
    walletId: 'wallet-personal',
    name: 'Alimentação',
    type: 'EXPENSE',
    color: '#f97316',
    icon: 'utensils',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'category-transport',
    walletId: 'wallet-personal',
    name: 'Transporte',
    type: 'EXPENSE',
    color: '#2563eb',
    icon: 'car',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
]

export const { read: readCategories, write: writeCategories } =
  createLocalStorageCollection({
    storageKey: CATEGORIES_STORAGE_KEY,
    initialData: mockCategories,
  })
