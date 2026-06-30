import * as categoryApi from '@/mocks/api/categoryApi.mock'

export const listCategoriesForWallet = (params) =>
  categoryApi.listCategoriesForWallet(params)

export const createCategory = (categoryData) =>
  categoryApi.createCategory(categoryData)
