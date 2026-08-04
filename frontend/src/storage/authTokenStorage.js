export const API_SESSION_STORAGE_KEY = '@finance-tracker:api-session'

const storages = () => [window.localStorage, window.sessionStorage]

export function readApiSession() {
  for (const storage of storages()) {
    try {
      const value = storage.getItem(API_SESSION_STORAGE_KEY)
      if (value) return JSON.parse(value)
    } catch {
      // Storage may be unavailable in restricted browser contexts.
    }
  }
  return null
}

export function writeApiSession(session, rememberMe) {
  clearApiSession()
  const storage = rememberMe ? window.localStorage : window.sessionStorage
  storage.setItem(API_SESSION_STORAGE_KEY, JSON.stringify(session))
}

export function clearApiSession() {
  for (const storage of storages()) {
    try {
      storage.removeItem(API_SESSION_STORAGE_KEY)
    } catch {
      // React state is still cleared when storage is unavailable.
    }
  }
}
