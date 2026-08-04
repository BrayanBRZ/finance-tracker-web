import { createLocalStorageCollection } from '@/mocks/data/createLocalStorageCollection'

const USERS_STORAGE_KEY = '@project:users_data'

const mockUsers = [
  {
    id: '1',
    name: 'Admin',
    email: 'admin@example.com',
    password: '123456',
  },
  {
    id: '2',
    name: 'Marina Costa',
    email: 'marina@example.com',
    password: '123456',
  },
  {
    id: '3',
    name: 'Rafael Lima',
    email: 'rafael@example.com',
    password: '123456',
  },
  {
    id: '4',
    name: 'Camila Alves',
    email: 'camila@example.com',
    password: '123456',
  },
  {
    id: '5',
    name: 'Lucas Souza',
    email: 'lucas@example.com',
    password: '123456',
  },
]

export const { read: readUsers, write: writeUsers } =
  createLocalStorageCollection({
    storageKey: USERS_STORAGE_KEY,
    initialData: mockUsers,
  })
