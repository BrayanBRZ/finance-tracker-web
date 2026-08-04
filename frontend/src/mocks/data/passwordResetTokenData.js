import { createLocalStorageCollection } from '@/mocks/data/createLocalStorageCollection'

const RESET_TOKENS_STORAGE_KEY = '@project:password_reset_tokens_data'

export const { read: readPasswordResetTokens, write: writePasswordResetTokens } =
  createLocalStorageCollection({
    storageKey: RESET_TOKENS_STORAGE_KEY,
    initialData: [],
  })
