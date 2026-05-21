

const STORAGE_KEY = '@project:users'

const defaultUsers = [
  { id: 1, name: 'Admin', email: 'admin@example.com', password: '123456' },
]

export function getUsers() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers))
    return defaultUsers
  } catch {   
    return defaultUsers
  }
}

export function addUser({ name, email, password }) {
  const users = getUsers()
  const newUser = { id: Date.now(), name, email, password }
  users.push(newUser)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
  return newUser
}

export function emailExists(email) {
  return getUsers().some((u) => u.email.toLowerCase() === email.toLowerCase())
}