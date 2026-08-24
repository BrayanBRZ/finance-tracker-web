import { useCallback, useEffect, useMemo, useState } from 'react'
import { categoryAppearanceOptions } from '@/lib/categoryAppearance'
import { FINANCIAL_TYPES } from '@/domain/financialTypes'
import { useAsyncScopeGuard } from '@/hooks/shared/useAsyncScopeGuard'
import { isAbortError } from '@/services/api/client'
import {
  createCategory as createCategoryRequest,
  listCategories,
  removeCategory as removeCategoryRequest,
  updateCategory as updateCategoryRequest,
} from '@/services/categoryService'

const getErrorMessage = (error) =>
  error instanceof Error ? error.message : 'Não foi possível carregar as categorias.'

const groupCategoriesByType = (categories) => ({
  income: categories.filter((category) => category.type === FINANCIAL_TYPES.INCOME),
  expense: categories.filter((category) => category.type === FINANCIAL_TYPES.EXPENSE),
})

export function useCategories({ type } = {}) {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const { beginRequest, captureScope, invalidateRequests, isRequestCurrent, isScopeCurrent } =
    useAsyncScopeGuard(JSON.stringify([type ?? null]))

  const refreshCategories = useCallback(
    async ({ signal } = {}) => {
      const request = beginRequest()
      setIsLoading(true)
      setErrorMessage(null)
      try {
        const nextCategories = await listCategories({ type, signal })
        if (!isRequestCurrent(request)) return []
        setCategories(nextCategories)
        return nextCategories
      } catch (error) {
        if (isAbortError(error) || !isRequestCurrent(request)) return []
        setCategories([])
        setErrorMessage(getErrorMessage(error))
        return []
      } finally {
        if (isRequestCurrent(request)) setIsLoading(false)
      }
    },
    [beginRequest, isRequestCurrent, type],
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

  const createCategory = useCallback(
    async (data) => {
      const scope = captureScope()
      const category = await createCategoryRequest(data)
      if (isScopeCurrent(scope)) {
        invalidateRequests()
        setCategories((current) => [...current, category].sort((left, right) => left.name.localeCompare(right.name)))
      }
      return category
    },
    [captureScope, invalidateRequests, isScopeCurrent],
  )

  const updateCategory = useCallback(
    async (categoryId, data) => {
      const scope = captureScope()
      const category = await updateCategoryRequest(categoryId, data)
      if (isScopeCurrent(scope)) {
        invalidateRequests()
        setCategories((current) =>
          current
            .map((item) => (item.id === category.id ? category : item))
            .sort((left, right) => left.name.localeCompare(right.name)),
        )
      }
      return category
    },
    [captureScope, invalidateRequests, isScopeCurrent],
  )

  const removeCategory = useCallback(
    async (categoryId) => {
      const scope = captureScope()
      await removeCategoryRequest(categoryId)
      if (isScopeCurrent(scope)) {
        invalidateRequests()
        setCategories((current) => current.filter((item) => item.id !== categoryId))
      }
    },
    [captureScope, invalidateRequests, isScopeCurrent],
  )

  const groupedCategories = useMemo(() => groupCategoriesByType(categories), [categories])

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
