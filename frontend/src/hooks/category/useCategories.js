import { useCallback, useEffect, useMemo, useState } from 'react'
import { categoryAppearanceOptions } from '@/lib/categoryAppearance'
import { FINANCIAL_TYPES } from '@/domain/financialTypes'
import { isAbortError } from '@/services/api/client'
import {
  createCategory as createCategoryRequest,
  listCategories,
  removeCategory as removeCategoryRequest,
  updateCategory as updateCategoryRequest,
} from '@/services/categoryService'

const getErrorMessage = (error) =>
  error instanceof Error
    ? error.message
    : 'Não foi possível carregar as categorias.'

const groupCategoriesByType = (categories) => ({
  income: categories.filter(
    (category) => category.type === FINANCIAL_TYPES.INCOME,
  ),
  expense: categories.filter(
    (category) => category.type === FINANCIAL_TYPES.EXPENSE,
  ),
})

export function useCategories({ type } = {}) {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const refreshCategories = useCallback(
    async ({ signal } = {}) => {
      setIsLoading(true)
      setErrorMessage(null)
      try {
        const nextCategories = await listCategories({ type, signal })
        setCategories(nextCategories)
        return nextCategories
      } catch (error) {
        if (isAbortError(error)) return []
        setCategories([])
        setErrorMessage(getErrorMessage(error))
        return []
      } finally {
        if (!signal?.aborted) setIsLoading(false)
      }
    },
    [type],
  )

  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      await Promise.resolve()
      await refreshCategories({ signal: controller.signal })
    }
    void load()
    return () => controller.abort()
  }, [refreshCategories])

  const createCategory = useCallback(async (data) => {
    const category = await createCategoryRequest(data)
    setCategories((current) =>
      [...current, category].sort((left, right) =>
        left.name.localeCompare(right.name),
      ),
    )
    return category
  }, [])

  const updateCategory = useCallback(async (categoryId, data) => {
    const category = await updateCategoryRequest(categoryId, data)
    setCategories((current) =>
      current
        .map((item) => (item.id === category.id ? category : item))
        .sort((left, right) => left.name.localeCompare(right.name)),
    )
    return category
  }, [])

  const removeCategory = useCallback(async (categoryId) => {
    await removeCategoryRequest(categoryId)
    setCategories((current) => current.filter((item) => item.id !== categoryId))
  }, [])

  const groupedCategories = useMemo(
    () => groupCategoriesByType(categories),
    [categories],
  )

  return {
    categories,
    appearanceOptions: categoryAppearanceOptions,
    groupedCategories,
    hasCategories: categories.length > 0,
    isLoading,
    errorMessage,
    refreshCategories,
    createCategory,
    updateCategory,
    removeCategory,
  }
}
