import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSession } from '@/context/sessionContext'
import { FINANCIAL_TYPES } from '@/domain/financialTypes'
import { useAsyncScopeGuard } from '@/hooks/useAsyncScopeGuard'
import {
  createCategory as createCategoryOperation,
  listCategoryAppearanceOptions,
  listCategoriesForUser,
  removeCategory as removeCategoryOperation,
  updateCategory as updateCategoryOperation,
} from '@/services/categoryService'

const emptyAppearanceOptions = {
  colors: [],
  icons: [],
}

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

export function useCategories() {
  const { session } = useSession()
  const userId = session?.user.id
  const [categories, setCategories] = useState([])
  const [appearanceOptions, setAppearanceOptions] = useState(
    emptyAppearanceOptions,
  )
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const {
    beginRequest,
    captureScope,
    invalidateRequests,
    isRequestCurrent,
    isScopeCurrent,
  } = useAsyncScopeGuard(JSON.stringify([userId ?? null]))

  const loadCategories = useCallback(async () => {
    const request = beginRequest()

    if (!userId) {
      if (isRequestCurrent(request)) {
        setCategories([])
        setAppearanceOptions(emptyAppearanceOptions)
        setIsLoading(false)
        setErrorMessage(null)
      }

      return []
    }

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const [nextCategories, nextAppearanceOptions] = await Promise.all([
        listCategoriesForUser({ userId }),
        listCategoryAppearanceOptions({ userId }),
      ])

      if (!isRequestCurrent(request)) return []

      setCategories(nextCategories)
      setAppearanceOptions(nextAppearanceOptions)
      return nextCategories
    } catch (error) {
      if (!isRequestCurrent(request)) return []

      setCategories([])
      setAppearanceOptions(emptyAppearanceOptions)
      setErrorMessage(getErrorMessage(error))
      return []
    } finally {
      if (isRequestCurrent(request)) {
        setIsLoading(false)
      }
    }
  }, [beginRequest, isRequestCurrent, userId])

  const createCategory = useCallback(
    async (categoryData) => {
      if (!userId) {
        const error = new Error('Faça login para criar categorias.')
        setErrorMessage(error.message)
        throw error
      }

      const mutationScope = captureScope()
      setErrorMessage(null)
      const { category } = await createCategoryOperation({
        userId,
        ...categoryData,
      })

      if (isScopeCurrent(mutationScope)) {
        invalidateRequests()
        setIsLoading(false)
        setCategories((currentCategories) => [...currentCategories, category])
      }

      return category
    },
    [captureScope, invalidateRequests, isScopeCurrent, userId],
  )

  const updateCategory = useCallback(
    async (categoryId, categoryData) => {
      if (!userId) throw new Error('Faça login para editar categorias.')

      const mutationScope = captureScope()
      const { category } = await updateCategoryOperation({
        userId,
        categoryId,
        ...categoryData,
      })

      if (isScopeCurrent(mutationScope)) {
        invalidateRequests()
        setIsLoading(false)
        setCategories((currentCategories) =>
          currentCategories.map((currentCategory) =>
            currentCategory.id === category.id ? category : currentCategory,
          ),
        )
      }

      return category
    },
    [captureScope, invalidateRequests, isScopeCurrent, userId],
  )

  const removeCategory = useCallback(
    async (categoryId) => {
      if (!userId) throw new Error('Faça login para excluir categorias.')

      const mutationScope = captureScope()
      await removeCategoryOperation({ userId, categoryId })

      if (isScopeCurrent(mutationScope)) {
        invalidateRequests()
        setIsLoading(false)
        setCategories((currentCategories) =>
          currentCategories.filter((category) => category.id !== categoryId),
        )
      }
    },
    [captureScope, invalidateRequests, isScopeCurrent, userId],
  )

  useEffect(() => {
    const synchronizeCategories = async () => {
      await Promise.resolve()
      await loadCategories()
    }

    void synchronizeCategories()
  }, [loadCategories])

  const groupedCategories = useMemo(
    () => groupCategoriesByType(categories),
    [categories],
  )

  return {
    categories,
    appearanceOptions,
    groupedCategories,
    hasCategories: categories.length > 0,
    isLoading,
    errorMessage,
    refreshCategories: loadCategories,
    createCategory,
    updateCategory,
    removeCategory,
  }
}
