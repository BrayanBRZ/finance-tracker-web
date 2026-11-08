package com.financetracker.api.dto.insight;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import com.financetracker.api.dto.summary.MonthlyTotalResponse;

// Deliberately excludes user/wallet IDs, member names and transaction descriptions.
public record InsightContext(LocalDate startDate, LocalDate endDate, String currency,
        BigDecimal totalIncome, BigDecimal totalExpense, BigDecimal balance, long transactionCount,
        List<ExpenseCategory> expenseCategories, List<MonthlyTotalResponse> byMonth) {
    public record ExpenseCategory(String name, BigDecimal total, BigDecimal percentage) { }
}
