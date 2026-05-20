import { getUsers, addUser } from '@/mocks/users.mock.js'

export const registerUser = async ({ name, email, password }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsers()
      const emailTaken = users.some(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      )

      if (emailTaken) {
        reject(new Error('Este e-mail já está cadastrado.'))
        return
      }

      const newUser = addUser({ name, email, password })
      const { password: _, ...userData } = newUser

      resolve({ user: userData })
    }, 800)
  })
}