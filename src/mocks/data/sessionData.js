export const SESSION_STORAGE_KEY = '@project:auth-session'

const parseSession = (value) => {
  if (!value) return null

  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

export function readSessionRecord() {
  try {
    return (
      parseSession(localStorage.getItem(SESSION_STORAGE_KEY)) ??
      parseSession(sessionStorage.getItem(SESSION_STORAGE_KEY))
    )
  } catch {
    return null
  }
}

export function writeSessionRecord(session, { persistent }) {
  const serializedSession = JSON.stringify(session)

  if (persistent) {
    sessionStorage.removeItem(SESSION_STORAGE_KEY)
    localStorage.setItem(SESSION_STORAGE_KEY, serializedSession)
  } else {
    localStorage.removeItem(SESSION_STORAGE_KEY)
    sessionStorage.setItem(SESSION_STORAGE_KEY, serializedSession)
  }
}

export function clearSessionRecord() {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY)
    sessionStorage.removeItem(SESSION_STORAGE_KEY)

  } catch {
    // The React session is still cleared when browser storage is unavailable.
  }
}
