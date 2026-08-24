import { apiRequest } from '@/services/api/client'

export const createCategory = (data) =>
  apiRequest('/categories', { method: 'POST', body: data })

export const listCategories = ({ type, signal } = {}) =>
  apiRequest('/categories', { query: { type }, signal })

export const updateCategory = (categoryId, data) =>
  apiRequest(`/categories/${categoryId}`, { method: 'PUT', body: data })

export const removeCategory = (categoryId) =>
  apiRequest(`/categories/${categoryId}`, { method: 'DELETE' })
