import { getUsers, addUser } from '@/mocks/users.mock.js'
import { AppError } from '@/utils/appError'

export const registerUser = async ({ name, email, password }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsers()
      const emailTaken = users.some(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      )

      if (emailTaken) {
        return reject(new AppError('Este e-mail já está cadastrado', 409, 'email'))
      }

      const newUser = addUser({ name, email, password })
      const { password: _, ...userData } = newUser
      resolve({ user: userData }) // Retorno não está sendo utilizado no momento
    }, 1000)
  })
}