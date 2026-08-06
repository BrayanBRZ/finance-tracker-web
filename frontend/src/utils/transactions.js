export function compareTransactionsByRecency(left, right) {
  const dateComparison = String(right.date).localeCompare(String(left.date))

  if (dateComparison !== 0) return dateComparison

  return String(right.createdAt ?? '').localeCompare(
    String(left.createdAt ?? ''),
  )
}

export function sortTransactionsByRecency(transactions) {
  return [...transactions].sort(compareTransactionsByRecency)
}
