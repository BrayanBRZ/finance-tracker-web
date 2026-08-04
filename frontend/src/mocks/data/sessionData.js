export const SESSION_STORAGE_KEY = '@project:user_session_data'

export function readSessionRecord() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY))
  } catch {
    return null
  }
}

export function writeSessionRecord(session) {
  const serializedSession = JSON.stringify(session)

  localStorage.setItem(SESSION_STORAGE_KEY, serializedSession)
}

export function clearSessionRecord() {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY)
  } catch {
    // The React session is still cleared when browser storage is unavailable.
  }
}
