const USERS_STORAGE_KEY = '@project:users'

const defaultUsers = [
  {
    id: 'user-admin',
    name: 'Admin',
    email: 'admin@example.com',
    password: '123456',
  },
]

const cloneDefaultUsers = () => defaultUsers.map((user) => ({ ...user }))

export function readUsers() {
  try {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY)

    if (!storedUsers) {
      const users = cloneDefaultUsers()
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
      return users
    }

    const users = JSON.parse(storedUsers)

    return Array.isArray(users) ? users : cloneDefaultUsers()
  } catch {
    return cloneDefaultUsers()
  }
}

export function writeUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}
