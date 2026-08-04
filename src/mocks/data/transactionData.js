import { createLocalStorageCollection } from '@/mocks/data/createLocalStorageCollection'

const TRANSACTIONS_STORAGE_KEY = '@project:transactions_data'

const createMonthlyPair = ({
  key,
  walletId,
  recordedById,
  incomeCategoryId,
  expenseCategoryId,
  incomeDescription,
  expenseDescription,
  incomeAmount,
  expenseAmount,
  incomeDate,
  expenseDate,
}) => [
  {
    id: `transaction-${key}-income`,
    walletId,
    categoryId: incomeCategoryId,
    recordedById,
    description: incomeDescription,
    amount: incomeAmount,
    type: 'INCOME',
    transactionDate: incomeDate,
    createdAt: `${incomeDate}T10:00:00.000Z`,
    updatedAt: `${incomeDate}T10:00:00.000Z`,
  },
  {
    id: `transaction-${key}-expense`,
    walletId,
    categoryId: expenseCategoryId,
    recordedById,
    description: expenseDescription,
    amount: expenseAmount,
    type: 'EXPENSE',
    transactionDate: expenseDate,
    createdAt: `${expenseDate}T12:00:00.000Z`,
    updatedAt: `${expenseDate}T12:00:00.000Z`,
  },
]

const personalMonthlyTransactions = [
  ['2025-08', '2025-08-05', '2025-08-10', 4700, 520, 'category-food', 'Mercado de agosto'],
  ['2025-09', '2025-09-05', '2025-09-12', 4700, 180, 'category-transport', 'Transporte de setembro'],
  ['2025-10', '2025-10-05', '2025-10-14', 4800, 240, 'category-health', 'Consulta médica'],
  ['2025-11', '2025-11-05', '2025-11-16', 4800, 190, 'category-leisure', 'Passeio de novembro'],
  ['2025-12', '2025-12-05', '2025-12-18', 6200, 120, 'category-subscriptions', 'Assinaturas de dezembro'],
  ['2026-02', '2026-02-05', '2026-02-09', 5000, 710, 'category-food', 'Compras de fevereiro'],
  ['2026-03', '2026-03-05', '2026-03-11', 5000, 220, 'category-transport', 'Transporte de março'],
  ['2026-04', '2026-04-05', '2026-04-13', 5200, 360, 'category-education', 'Curso de abril'],
  ['2026-05', '2026-05-05', '2026-05-15', 5200, 260, 'category-leisure', 'Lazer de maio'],
  ['2026-06', '2026-06-05', '2026-06-17', 5200, 145, 'category-subscriptions', 'Assinaturas de junho'],
  ['2026-07', '2026-07-05', '2026-07-19', 5400, 760, 'category-food', 'Compras de julho'],
  ['2026-08', '2026-08-05', '2026-08-20', 5400, 280, 'category-transport', 'Transporte de agosto'],
].flatMap(
  ([
    key,
    incomeDate,
    expenseDate,
    incomeAmount,
    expenseAmount,
    expenseCategoryId,
    expenseDescription,
  ]) =>
    createMonthlyPair({
      key: `personal-${key}`,
      walletId: 'wallet-personal',
      recordedById: '1',
      incomeCategoryId: 'category-salary',
      expenseCategoryId,
      incomeDescription: `Salário de ${key}`,
      expenseDescription,
      incomeAmount,
      expenseAmount,
      incomeDate,
      expenseDate,
    }),
)

const houseMonthlyTransactions = [
  ['2026-05', '2026-05-03', '2026-05-08', 1800, 1250],
  ['2026-06', '2026-06-03', '2026-06-08', 1800, 1280],
  ['2026-07', '2026-07-03', '2026-07-08', 1900, 1320],
  ['2026-08', '2026-08-03', '2026-08-08', 1900, 1350],
].flatMap(([key, incomeDate, expenseDate, incomeAmount, expenseAmount]) =>
  createMonthlyPair({
    key: `house-${key}`,
    walletId: 'wallet-house',
    recordedById: '1',
    incomeCategoryId: 'category-rental-income',
    expenseCategoryId: 'category-housing',
    incomeDescription: `Repasse da casa ${key}`,
    expenseDescription: `Custos da casa ${key}`,
    incomeAmount,
    expenseAmount,
    incomeDate,
    expenseDate,
  }),
)

const freelancerMonthlyTransactions = [
  ['2026-06', '2026-06-12', '2026-06-15', 2600, 180],
  ['2026-07', '2026-07-12', '2026-07-15', 3200, 240],
  ['2026-08', '2026-08-12', '2026-08-15', 2900, 210],
].flatMap(([key, incomeDate, expenseDate, incomeAmount, expenseAmount]) =>
  createMonthlyPair({
    key: `freelancer-${key}`,
    walletId: 'wallet-freelancer',
    recordedById: '2',
    incomeCategoryId: 'category-client-payments',
    expenseCategoryId: 'category-tools',
    incomeDescription: `Projeto entregue ${key}`,
    expenseDescription: `Ferramentas de trabalho ${key}`,
    incomeAmount,
    expenseAmount,
    incomeDate,
    expenseDate,
  }),
)

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
  ...personalMonthlyTransactions,
  ...houseMonthlyTransactions,
  ...freelancerMonthlyTransactions,
]

export const { read: readTransactions, write: writeTransactions } =
  createLocalStorageCollection({
    storageKey: TRANSACTIONS_STORAGE_KEY,
    initialData: mockTransactions,
  })
