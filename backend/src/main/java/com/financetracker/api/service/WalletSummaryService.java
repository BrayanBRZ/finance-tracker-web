package com.financetracker.api.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.financetracker.api.dto.summary.CategoryTotalResponse;
import com.financetracker.api.dto.summary.MonthlyTotalResponse;
import com.financetracker.api.dto.summary.WalletSummaryResponse;
import com.financetracker.api.entity.Transaction;
import com.financetracker.api.enums.TransactionType;
import com.financetracker.api.repository.TransactionRepository;
import com.financetracker.api.repository.TransactionSpecifications;
import com.financetracker.api.validation.DateRangeValidator;

@Service
public class WalletSummaryService {
    private final TransactionRepository transactionRepository;
    private final WalletAccessService walletAccess;

    public WalletSummaryService(TransactionRepository transactionRepository, WalletAccessService walletAccess) {
        this.transactionRepository = transactionRepository;
        this.walletAccess = walletAccess;
    }

    @Transactional(readOnly = true)
    public WalletSummaryResponse get(Long userId, Long walletId, LocalDate startDate, LocalDate endDate) {
        walletAccess.requireMember(walletId, userId);
        DateRangeValidator.validate(startDate, endDate);

        List<Transaction> entries = transactionRepository.findAll(
                TransactionSpecifications.byWalletAndPeriod(walletId, startDate, endDate));
        BigDecimal totalIncome = totalByType(entries, TransactionType.INCOME);
        BigDecimal totalExpense = totalByType(entries, TransactionType.EXPENSE);

        return new WalletSummaryResponse(
                totalIncome,
                totalExpense,
                totalIncome.subtract(totalExpense),
                entries.size(),
                byCategory(entries),
                byMonth(entries));
    }

    private BigDecimal totalByType(List<Transaction> entries, TransactionType type) {
        return entries.stream()
                .filter(entry -> entry.getType() == type)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private List<CategoryTotalResponse> byCategory(List<Transaction> entries) {
        Map<Long, CategoryAmounts> totals = new LinkedHashMap<>();
        for (Transaction entry : entries) {
            if (entry.getCategory() == null) {
                continue;
            }
            totals.compute(entry.getCategory().getId(), (id, current) -> current == null
                    ? new CategoryAmounts(entry.getCategory().getName(), entry.getAmount())
                    : current.add(entry.getAmount()));
        }

        return totals.entrySet().stream()
                .map(entry -> new CategoryTotalResponse(entry.getKey(), entry.getValue().name(),
                        entry.getValue().total()))
                .sorted(Comparator.comparing(CategoryTotalResponse::total).reversed()
                        .thenComparing(CategoryTotalResponse::categoryName))
                .toList();
    }

    private List<MonthlyTotalResponse> byMonth(List<Transaction> entries) {
        Map<YearMonth, MonthlyAmounts> totals = new LinkedHashMap<>();
        for (Transaction entry : entries) {
            YearMonth month = YearMonth.from(entry.getTransactionDate());
            totals.computeIfAbsent(month, ignored -> new MonthlyAmounts()).add(entry);
        }

        return totals.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> new MonthlyTotalResponse(
                        entry.getKey().toString(),
                        entry.getValue().income,
                        entry.getValue().expense))
                .toList();
    }

    private record CategoryAmounts(String name, BigDecimal total) {
        CategoryAmounts add(BigDecimal amount) {
            return new CategoryAmounts(name, total.add(amount));
        }
    }

    private static final class MonthlyAmounts {
        private BigDecimal income = BigDecimal.ZERO;
        private BigDecimal expense = BigDecimal.ZERO;

        private void add(Transaction entry) {
            if (entry.getType() == TransactionType.INCOME) {
                income = income.add(entry.getAmount());
            } else {
                expense = expense.add(entry.getAmount());
            }
        }
    }
}
