import { readUsers, writeUsers } from '@/mocks/data/userData'
import {
  clearSessionRecord,
  readSessionRecord,
  SESSION_STORAGE_KEY,
  writeSessionRecord,
} from '@/mocks/data/sessionData'

const SIMULATED_LATENCY_MS = 400

const delay = () =>
  new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS))

const normalizeEmail = (email) => email.trim().toLowerCase()

const withoutCredential = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
})

const createId = (prefix) => {
  const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`
  return `${prefix}-${id}`
}

export async function registerUser({ name, email, password }) {
  await delay()

  const normalizedEmail = normalizeEmail(email)
  const users = readUsers()
  const emailTaken = users.some(
    (user) => normalizeEmail(user.email) === normalizedEmail
  )

  if (emailTaken) {
    throw new Error('Este e-mail já está cadastrado')
  }

  const user = {
    id: createId('user'),
    name: name.trim(),
    email: normalizedEmail,
    password,
  }

  writeUsers([...users, user])

  return { user: withoutCredential(user) }
}

export async function login({ email, password, rememberMe = false }) {
  await delay()

  const normalizedEmail = normalizeEmail(email)
  const user = readUsers().find(
    (candidate) =>
      normalizeEmail(candidate.email) === normalizedEmail &&
      candidate.password === password
  )

  if (!user) {
    throw new Error('E-mail ou senha incorretos')
  }

  const sessionRecord = {
    token: createId('mock-session'),
    userId: user.id,
  }

  writeSessionRecord(sessionRecord, { persistent: rememberMe })

  return {
    token: sessionRecord.token,
    user: withoutCredential(user),
  }
}

export async function restoreSession() {
  const sessionRecord = readSessionRecord()

  if (!sessionRecord?.token || sessionRecord.userId == null) {
    clearSessionRecord()
    return null
  }

  const user = readUsers().find(
    (candidate) => String(candidate.id) === String(sessionRecord.userId)
  )

  if (!user) {
    clearSessionRecord()
    return null
  }

  return {
    token: sessionRecord.token,
    user: withoutCredential(user),
  }
}

export async function logout() {
  await delay()
  clearSessionRecord()
}

export function subscribeToAuthStateChanges(listener) {
  const handleStorage = (event) => {
    if (event.key === SESSION_STORAGE_KEY) {
      listener()
    }
  }

  window.addEventListener('storage', handleStorage)

  return () => window.removeEventListener('storage', handleStorage)
}
