package com.financetracker.api.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.financetracker.api.dto.insight.InsightContext;
import com.financetracker.api.dto.insight.InsightContext.ExpenseCategory;
import com.financetracker.api.dto.insight.InsightRequest;
import com.financetracker.api.dto.summary.MonthlyTotalResponse;
import com.financetracker.api.entity.Transaction;
import com.financetracker.api.enums.TransactionType;
import com.financetracker.api.exception.ApiException;
import com.financetracker.api.repository.TransactionRepository;
import com.financetracker.api.repository.TransactionSpecifications;
import com.financetracker.api.validation.DateRangeValidator;

@Service
public class WalletInsightContextService {
    private final WalletAccessService walletAccess;
    private final TransactionRepository transactions;

    public WalletInsightContextService(WalletAccessService walletAccess, TransactionRepository transactions) {
        this.walletAccess = walletAccess;
        this.transactions = transactions;
    }

    @Transactional(readOnly = true)
    public InsightContext load(Long userId, UUID walletId, InsightRequest request) {
        Long internalId = walletAccess.requireMember(walletId, userId).getWallet().getId();
        if (request.startDate() == null || request.endDate() == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Informe as datas inicial e final da análise");
        }
        DateRangeValidator.validate(request.startDate(), request.endDate());
        if (ChronoUnit.DAYS.between(request.startDate(), request.endDate()) > 365) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Selecione um período de até 366 dias para a análise");
        }
        List<Transaction> entries = transactions.findAll(
                TransactionSpecifications.byWalletAndPeriod(internalId, request.startDate(), request.endDate()));
        BigDecimal income = BigDecimal.ZERO;
        BigDecimal expense = BigDecimal.ZERO;
        Map<String, BigDecimal> categories = new TreeMap<>();
        Map<YearMonth, BigDecimal[]> months = new TreeMap<>();
        for (Transaction entry : entries) {
            BigDecimal amount = entry.getAmount();
            boolean isIncome = entry.getType() == TransactionType.INCOME;
            BigDecimal[] monthly = months.computeIfAbsent(YearMonth.from(entry.getTransactionDate()),
                    ignored -> new BigDecimal[] { BigDecimal.ZERO, BigDecimal.ZERO });
            monthly[isIncome ? 0 : 1] = monthly[isIncome ? 0 : 1].add(amount);
            if (isIncome) {
                income = income.add(amount);
            } else {
                expense = expense.add(amount);
                String category = entry.getCategory() == null ? "Sem categoria" : entry.getCategory().getName();
                categories.merge(category, amount, BigDecimal::add);
            }
        }
        BigDecimal expenseTotal = expense;
        List<Map.Entry<String, BigDecimal>> ranked = categories.entrySet().stream()
                .sorted(Map.Entry.<String, BigDecimal>comparingByValue(Comparator.reverseOrder())
                        .thenComparing(Map.Entry.comparingByKey())).toList();
        List<ExpenseCategory> breakdown = new ArrayList<>();
        for (var category : ranked.stream().limit(10).toList()) {
            breakdown.add(category(category.getKey(), category.getValue(), expenseTotal));
        }
        if (ranked.size() > 10) {
            BigDecimal others = ranked.stream().skip(10).map(Map.Entry::getValue).reduce(BigDecimal.ZERO, BigDecimal::add);
            breakdown.add(category("Demais categorias (agrupadas)", others, expenseTotal));
        }
        List<MonthlyTotalResponse> byMonth = months.entrySet().stream()
                .map(entry -> new MonthlyTotalResponse(entry.getKey().toString(), entry.getValue()[0], entry.getValue()[1]))
                .toList();
        return new InsightContext(request.startDate(), request.endDate(), "BRL", income, expense,
                income.subtract(expense), entries.size(), List.copyOf(breakdown), byMonth);
    }

    private ExpenseCategory category(String name, BigDecimal total, BigDecimal allExpenses) {
        BigDecimal percentage = allExpenses.signum() == 0 ? BigDecimal.ZERO
                : total.multiply(BigDecimal.valueOf(100)).divide(allExpenses, 2, RoundingMode.HALF_UP);
        return new ExpenseCategory(name, total, percentage);
    }
}
