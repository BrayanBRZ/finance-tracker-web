import { mockUsers } from '@/mocks/users.mock.js'

export const authenticateUser = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const userFound = mockUsers.users.find(
        (user) => user.email === email && user.password === password
      );

      if (userFound) {
        const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mockToken_' + Date.now()
        
        const { password: _, ...userData } = userFound

        resolve({
          user: userData,
          token: fakeToken,
        });
      } else {
        reject(new Error('E-mail ou senha incorretos.'));
      }
    }, 1000);
  })
}