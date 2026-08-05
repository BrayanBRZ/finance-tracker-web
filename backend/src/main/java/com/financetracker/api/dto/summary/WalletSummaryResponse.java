package com.financetracker.api.dto.summary;

import java.math.BigDecimal;
import java.util.List;

public record WalletSummaryResponse(
    BigDecimal totalIncome,
    BigDecimal totalExpense,
    BigDecimal balance,
    long transactionCount,
    List<CategoryTotalResponse> byCategory,
    List<MonthlyTotalResponse> byMonth
) {
}
