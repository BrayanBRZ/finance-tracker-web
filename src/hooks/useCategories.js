import { useCallback, useEffect, useMemo, useState } from 'react'
import { FINANCIAL_TYPES } from '@/domain/financialTypes'
import { useSession } from '@/context/sessionContext'
import { useWallet } from '@/context/walletContext'
import {
  createCategory as createCategoryOperation,
  listCategoriesForWallet,
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

export function useCategories() {
  const { session } = useSession()
  const { currentWallet } = useWallet()
  const userId = session?.user.id
  const walletId = currentWallet?.id
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const loadCategories = useCallback(async () => {
    if (!userId || !walletId) {
      setCategories([])
      setErrorMessage(null)

      return []
    }

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const nextCategories = await listCategoriesForWallet({
        userId,
        walletId,
      })

      setCategories(nextCategories)

      return nextCategories
    } catch (error) {
      setCategories([])
      setErrorMessage(getErrorMessage(error))

      return []
    } finally {
      setIsLoading(false)
    }
  }, [userId, walletId])

  const createCategory = useCallback(async (categoryData) => {
    if (!userId || !walletId) {
      const error = new Error('Selecione uma carteira antes de criar categorias.')

      setErrorMessage(error.message)
      throw error
    }

    setErrorMessage(null)

    try {
      const { category } = await createCategoryOperation({
        userId,
        walletId,
        ...categoryData,
      })

      setCategories((currentCategories) => [...currentCategories, category])

      return category
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
      throw error
    }
  }, [userId, walletId])

  useEffect(() => {
    let isActive = true

    const syncCategories = async () => {
      await Promise.resolve()

      if (isActive) {
        await loadCategories()
      }
    }

    void syncCategories()

    return () => {
      isActive = false
    }
  }, [loadCategories])

  const groupedCategories = useMemo(
    () => groupCategoriesByType(categories),
    [categories],
  )

  return {
    categories,
    groupedCategories,
    hasCategories: categories.length > 0,
    isLoading,
    errorMessage,
    refreshCategories: loadCategories,
    createCategory,
  }
}
