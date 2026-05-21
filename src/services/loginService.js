import { getUsers } from '@/mocks/users.mock.js'
import { AppError } from '@/utils/appError'

export const authenticateUser = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsers()
      const userFound = users.find(
        (user) => user.email === email && user.password === password
      )

      if (userFound) {
        const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mockToken_' + Date.now()
        
        const { password: _, ...userData } = userFound

        resolve({
          user: userData,
          token: fakeToken,
        });
      } else {
        reject(new AppError('E-mail ou senha incorretos', 404));
      }
    }, 1000);
  })
}