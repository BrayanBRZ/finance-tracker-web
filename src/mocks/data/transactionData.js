import { createLocalStorageCollection } from '@/mocks/data/createLocalStorageCollection'

const TRANSACTIONS_STORAGE_KEY = '@project:transactions_data'

const mockTransactions = [
  {
    id: 'transaction-salary-january',
    walletId: 'wallet-personal',
    categoryId: 'category-salary',
    recordedById: '1',
    description: 'Salário de janeiro',
    amount: 5000,
    type: 'INCOME',
    transactionDate: '2026-01-05',
    createdAt: '2026-01-05T10:00:00.000Z',
    updatedAt: '2026-01-05T10:00:00.000Z',
  },
  {
    id: 'transaction-food-january',
    walletId: 'wallet-personal',
    categoryId: 'category-food',
    recordedById: '1',
    description: 'Compras do mês',
    amount: 680.5,
    type: 'EXPENSE',
    transactionDate: '2026-01-08',
    createdAt: '2026-01-08T12:00:00.000Z',
    updatedAt: '2026-01-08T12:00:00.000Z',
  },
]

export const { read: readTransactions, write: writeTransactions } =
  createLocalStorageCollection({
    storageKey: TRANSACTIONS_STORAGE_KEY,
    initialData: mockTransactions,
  })
