import * as categoryApi from '@/mocks/api/categoryApi.mock'

export const listCategoriesForWallet = (params) =>
  categoryApi.listCategoriesForWallet(params)

export const createCategory = (categoryData) =>
  categoryApi.createCategory(categoryData)

export const updateCategory = (categoryData) =>
  categoryApi.updateCategory(categoryData)

export const removeCategory = (categoryData) =>
  categoryApi.removeCategory(categoryData)
