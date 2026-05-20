const MOCK_USER = {
  id: '1',
  name: 'João Silva',
  email: 'user@example.com',
  password: '123456',
  initials: 'JS',
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const authMock = {
  login: async (email, password) => {
    await delay(1000)
    if (email === MOCK_USER.email && password === MOCK_USER.password) {
      const token = 'mock-token-xyz-abc'
      const user = {
        id: MOCK_USER.id,
        name: MOCK_USER.name,
        email: MOCK_USER.email,
        initials: MOCK_USER.initials,
      }
      localStorage.setItem('paytrace_token', token)
      localStorage.setItem('paytrace_user', JSON.stringify(user))
      return { token, user }
    }
    throw new Error('E-mail ou senha inválidos')
  },

  register: async (name, email, _password) => {
    await delay(1000)
    if (email === MOCK_USER.email) {
      throw new Error('E-mail já cadastrado')
    }
    return { success: true }
  },

  forgotPassword: async (_email) => {
    await delay(1000)
    // Always returns success — never reveals if e-mail exists
    return { success: true }
  },

  resetPassword: async (token, _newPassword) => {
    await delay(1000)
    if (!token) throw new Error('Token inválido ou expirado')
    return { success: true }
  },

  changePassword: async (currentPassword, _newPassword) => {
    await delay(1000)
    if (currentPassword !== MOCK_USER.password) {
      throw new Error('Senha atual incorreta')
    }
    return { success: true }
  },

  logout: () => {
    localStorage.removeItem('paytrace_token')
    localStorage.removeItem('paytrace_user')
  },

  getUser: () => {
    try {
      const raw = localStorage.getItem('paytrace_user')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('paytrace_token')
  },
}