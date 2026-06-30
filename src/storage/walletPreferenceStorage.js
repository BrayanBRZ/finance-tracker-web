const WALLET_PREFERENCES_STORAGE_KEY = '@project:wallet_preferences'

const canUseLocalStorage = () =>
  typeof window !== 'undefined' && window.localStorage

const readWalletPreferences = () => {
  if (!canUseLocalStorage()) {
    return {}
  }

  const storedWalletPreferences = window.localStorage.getItem(
    WALLET_PREFERENCES_STORAGE_KEY,
  )

  if (!storedWalletPreferences) {
    return {}
  }

  try {
    return JSON.parse(storedWalletPreferences)
  } catch {
    window.localStorage.removeItem(WALLET_PREFERENCES_STORAGE_KEY)
    return {}
  }
}

const writeWalletPreferences = (walletPreferences) => {
  if (!canUseLocalStorage()) {
    return
  }

  window.localStorage.setItem(
    WALLET_PREFERENCES_STORAGE_KEY,
    JSON.stringify(walletPreferences),
  )
}

export function readSelectedWalletId(userId) {
  if (!userId) {
    return null
  }

  return readWalletPreferences()[userId] ?? null
}

export function writeSelectedWalletId({ userId, walletId }) {
  if (!userId || !walletId) {
    return
  }

  writeWalletPreferences({
    ...readWalletPreferences(),
    [userId]: walletId,
  })
}

export function clearSelectedWalletId(userId) {
  if (!userId) {
    return
  }

  const walletPreferences = readWalletPreferences()
  const nextWalletPreferences = { ...walletPreferences }

  delete nextWalletPreferences[userId]

  writeWalletPreferences(nextWalletPreferences)
}
