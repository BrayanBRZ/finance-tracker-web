export const SESSION_STORAGE_KEY = '@project:user_session_data'

export function readSessionRecord() {
  for (const storage of [localStorage, sessionStorage]) {
    try {
      const value = storage.getItem(SESSION_STORAGE_KEY)
      if (value) return JSON.parse(value)
    } catch {
      // Continue with the other browser storage.
    }
  }
  return null
}

export function writeSessionRecord(session) {
  const serializedSession = JSON.stringify(session)

  clearSessionRecord()
  const storage = session.rememberMe ? localStorage : sessionStorage
  storage.setItem(SESSION_STORAGE_KEY, serializedSession)
}

export function clearSessionRecord() {
  for (const storage of [localStorage, sessionStorage]) {
    try {
      storage.removeItem(SESSION_STORAGE_KEY)
    } catch {
      // The React session is still cleared when storage is unavailable.
    }
  }
}
