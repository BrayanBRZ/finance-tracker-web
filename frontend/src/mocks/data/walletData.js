import { createLocalStorageCollection } from '@/mocks/data/createLocalStorageCollection'

const WALLETS_STORAGE_KEY = '@project:wallets_data'

const mockWallets = [
  {
    id: 'wallet-personal',
    createdById: '1',
    name: 'Carteira pessoal',
    description: 'Carteira inicial para desenvolvimento.',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'wallet-house',
    createdById: '1',
    name: 'Casa',
    description: 'Despesas e receitas compartilhadas da residência.',
    createdAt: '2026-01-02T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
  },
  {
    id: 'wallet-freelancer',
    createdById: '2',
    name: 'Freelancer',
    description: 'Controle financeiro de projetos e serviços.',
    createdAt: '2026-01-03T00:00:00.000Z',
    updatedAt: '2026-01-03T00:00:00.000Z',
  },
]

export const { read: readWallets, write: writeWallets } =
  createLocalStorageCollection({
    storageKey: WALLETS_STORAGE_KEY,
    initialData: mockWallets,
  })
