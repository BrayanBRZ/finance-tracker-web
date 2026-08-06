import { apiRequest } from '@/services/apiClient'

export const listCategories = ({ type, signal } = {}) =>
  apiRequest('/categories', { query: { type }, signal })

export const createCategory = (data) =>
  apiRequest('/categories', { method: 'POST', body: data })

export const updateCategory = (categoryId, data) =>
  apiRequest(`/categories/${categoryId}`, { method: 'PUT', body: data })

export const removeCategory = (categoryId) =>
  apiRequest(`/categories/${categoryId}`, { method: 'DELETE' })
