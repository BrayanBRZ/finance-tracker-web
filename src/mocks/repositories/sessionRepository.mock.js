import * as SessionData from '@/mocks/data/sessionData'

export const SESSION_STORAGE_KEY = SessionData.SESSION_STORAGE_KEY

export function readSessionRecord() {
  return SessionData.readSessionRecord()
}

export function writeSessionRecord(sessionRecord) {
  SessionData.writeSessionRecord(sessionRecord)
}

export function clearSessionRecord() {
  SessionData.clearSessionRecord()
}
