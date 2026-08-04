import {
  clearApiSession,
  readApiSession,
} from '@/storage/authTokenStorage'

const API_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1'

export class ApiError extends Error {
  constructor(message, { status, fieldErrors } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
    this.field = fieldErrors ? Object.keys(fieldErrors)[0] : undefined
  }
}

export async function apiRequest(path, options = {}) {
  const session = readApiSession()
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')

  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }
  if (session?.accessToken) {
    headers.set('Authorization', `Bearer ${session.accessToken}`)
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    body:
      options.body === undefined ? undefined : JSON.stringify(options.body),
  })

  if (response.status === 401) clearApiSession()
  if (response.status === 204) return null

  const body = await response.json().catch(() => null)
  if (!response.ok) {
    throw new ApiError(body?.message ?? 'Não foi possível concluir a operação.', {
      status: response.status,
      fieldErrors: body?.fieldErrors,
    })
  }
  return body
}
