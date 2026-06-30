import { readCategories, writeCategories } from '@/mocks/data/categoryData'
import { isSameId } from '@/mocks/utils/id'
import { isSameNormalizedText } from '@/mocks/utils/text'

export function listCategories() {
  return readCategories()
}

export function listCategoriesByWalletId(walletId) {
  return listCategories().filter((category) =>
    isSameId(category.walletId, walletId),
  )
}

export function findCategoryByNameInWallet({ walletId, name }) {
  return listCategoriesByWalletId(walletId).find((category) =>
    isSameNormalizedText(category.name, name),
  )
}

export function appendCategory(category) {
  writeCategories([...listCategories(), category])
}
