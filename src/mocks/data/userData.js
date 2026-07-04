import { createLocalStorageCollection } from '@/mocks/data/createLocalStorageCollection'

const USERS_STORAGE_KEY = '@project:users_data'

const mockUsers = [
  {
    id: '1',
    name: 'Admin',
    email: 'admin@example.com',
    password: '123456',
  },
]

export const { read: readUsers, write: writeUsers } =
  createLocalStorageCollection({
    storageKey: USERS_STORAGE_KEY,
    initialData: mockUsers,
  })
