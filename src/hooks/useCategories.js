import { useCallback, useEffect, useMemo, useState } from 'react'
import { FINANCIAL_TYPES } from '@/domain/financialTypes'
import { useSession } from '@/context/sessionContext'
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

  const loadCategories = useCallback(async () => {
    if (!userId) {
      setCategories([])
      setAppearanceOptions(emptyAppearanceOptions)
      setErrorMessage(null)
      return []
    }

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const [nextCategories, nextAppearanceOptions] = await Promise.all([
        listCategoriesForUser({ userId }),
        listCategoryAppearanceOptions({ userId }),
      ])
      setCategories(nextCategories)
      setAppearanceOptions(nextAppearanceOptions)
      return nextCategories
    } catch (error) {
      setCategories([])
      setAppearanceOptions(emptyAppearanceOptions)
      setErrorMessage(getErrorMessage(error))
      return []
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  const createCategory = useCallback(async (categoryData) => {
    if (!userId) {
      const error = new Error('Faça login para criar categorias.')
      setErrorMessage(error.message)
      throw error
    }

    setErrorMessage(null)
    const { category } = await createCategoryOperation({ userId, ...categoryData })
    setCategories((currentCategories) => [...currentCategories, category])
    return category
  }, [userId])

  const updateCategory = useCallback(async (categoryId, categoryData) => {
    if (!userId) throw new Error('Faça login para editar categorias.')

    const { category } = await updateCategoryOperation({
      userId,
      categoryId,
      ...categoryData,
    })

    setCategories((currentCategories) =>
      currentCategories.map((currentCategory) =>
        currentCategory.id === category.id ? category : currentCategory,
      ),
    )

    return category
  }, [userId])

  const removeCategory = useCallback(async (categoryId) => {
    if (!userId) throw new Error('Faça login para excluir categorias.')

    await removeCategoryOperation({ userId, categoryId })
    setCategories((currentCategories) =>
      currentCategories.filter((category) => category.id !== categoryId),
    )
  }, [userId])

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
