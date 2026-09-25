import { clearApiSession, readApiSession } from '@/storage/authTokenStorage'
import { ApiError } from './error'

const buildUrl = (path, query) => {
  const baseUrl = import.meta.env.VITE_API_URL
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const url = new URL(`${baseUrl}${normalizedPath}`)

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      url.searchParams.set(key, String(value))
    }
  })

  return url.toString()
}

export const isAbortError = (error) => error?.name === 'AbortError'

export async function apiRequest(
  path,
  {
    method = 'GET',
    query,
    body,
    headers: customHeaders,
    signal,
    auth = true,
    responseType = 'json',
  } = {},
) {
  const session = auth ? readApiSession() : null
  const headers = new Headers(customHeaders)
  headers.set(
    'Accept',
    responseType === 'blob'
      ? 'application/pdf, application/json'
      : 'application/json',
  )

  if (body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }
  if (session?.accessToken) {
    headers.set('Authorization', `Bearer ${session.accessToken}`)
  }

  let response
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      signal,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch (error) {
    if (isAbortError(error)) throw error
    throw new ApiError('Não foi possível conectar ao servidor.')
  }

  if (response.status === 401) clearApiSession()
  if (response.status === 204) return null

  if (!response.ok) {
    const responseBody = await response.json().catch(() => null)
    throw new ApiError(
      responseBody?.message ?? 'Não foi possível concluir a operação.',
      {
        status: response.status,
        fieldErrors: responseBody?.fieldErrors ?? {},
      },
    )
  }

  return responseType === 'blob'
    ? response.blob()
    : response.json().catch(() => null)
}
