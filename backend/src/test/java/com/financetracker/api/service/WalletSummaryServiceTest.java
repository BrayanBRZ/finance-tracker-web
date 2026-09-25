package com.financetracker.api.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.jpa.domain.Specification;

import com.financetracker.api.dto.summary.CategoryTotalResponse;
import com.financetracker.api.dto.summary.DailyTotalResponse;
import com.financetracker.api.dto.summary.WalletSummaryResponse;
import com.financetracker.api.entity.Category;
import com.financetracker.api.entity.Transaction;
import com.financetracker.api.entity.Wallet;
import com.financetracker.api.entity.WalletMember;
import com.financetracker.api.enums.TransactionType;
import com.financetracker.api.repository.TransactionRepository;

@ExtendWith(MockitoExtension.class)
class WalletSummaryServiceTest {
    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private WalletAccessService walletAccess;

    @InjectMocks
    private WalletSummaryService walletSummaryService;

    @Test
    void getIncludesUncategorizedTransactionsInCategoryTotals() {
        Long userId = 42L;
        UUID walletId = UUID.randomUUID();
        Wallet wallet = mock(Wallet.class);
        WalletMember member = mock(WalletMember.class);
        Transaction uncategorized = transaction(null, new BigDecimal("125.50"));
        Category category = mock(Category.class);
        UUID categoryId = UUID.randomUUID();
        when(category.getUuid()).thenReturn(categoryId);
        when(category.getName()).thenReturn("Alimentação");
        Transaction categorized = transaction(category, new BigDecimal("80.00"));

        when(member.getWallet()).thenReturn(wallet);
        when(wallet.getId()).thenReturn(7L);
        when(walletAccess.requireMember(walletId, userId)).thenReturn(member);
        when(transactionRepository.findAll(org.mockito.ArgumentMatchers.<Specification<Transaction>>any()))
                .thenReturn(List.of(uncategorized, categorized));

        WalletSummaryResponse response = walletSummaryService.get(userId, walletId, null, null);

        assertEquals(List.of(
                new CategoryTotalResponse(null, "Sem categoria", new BigDecimal("125.50")),
                new CategoryTotalResponse(categoryId, "Alimentação", new BigDecimal("80.00"))), response.byCategory());
    }

    @Test
    void getIncludesBothEndsOfDailyRangeAndFillsDaysWithoutTransactions() {
        Long userId = 42L;
        UUID walletId = UUID.randomUUID();
        Wallet wallet = mock(Wallet.class);
        WalletMember member = mock(WalletMember.class);
        when(member.getWallet()).thenReturn(wallet);
        when(wallet.getId()).thenReturn(7L);
        when(walletAccess.requireMember(walletId, userId)).thenReturn(member);
        Transaction first = transaction(null, new BigDecimal("10.00"), TransactionType.INCOME,
                LocalDate.of(2026, 9, 1));
        Transaction last = transaction(null, new BigDecimal("4.00"), TransactionType.EXPENSE,
                LocalDate.of(2026, 9, 3));
        when(transactionRepository.findAll(org.mockito.ArgumentMatchers.<Specification<Transaction>>any()))
                .thenReturn(List.of(first, last));

        WalletSummaryResponse response = walletSummaryService.get(
                userId, walletId, LocalDate.of(2026, 9, 1), LocalDate.of(2026, 9, 3));

        assertEquals(new BigDecimal("10.00"), response.totalIncome());
        assertEquals(new BigDecimal("4.00"), response.totalExpense());
        assertEquals(new BigDecimal("6.00"), response.balance());
        assertEquals(List.of(
                new DailyTotalResponse(LocalDate.of(2026, 9, 1), new BigDecimal("10.00"), BigDecimal.ZERO),
                new DailyTotalResponse(LocalDate.of(2026, 9, 2), BigDecimal.ZERO, BigDecimal.ZERO),
                new DailyTotalResponse(LocalDate.of(2026, 9, 3), BigDecimal.ZERO, new BigDecimal("4.00"))),
                response.byDay());
    }

    private Transaction transaction(Category category, BigDecimal amount) {
        return transaction(category, amount, TransactionType.EXPENSE, LocalDate.of(2026, 9, 1));
    }

    private Transaction transaction(Category category, BigDecimal amount, TransactionType type, LocalDate date) {
        Transaction transaction = mock(Transaction.class);
        when(transaction.getCategory()).thenReturn(category);
        when(transaction.getAmount()).thenReturn(amount);
        when(transaction.getType()).thenReturn(type);
        when(transaction.getTransactionDate()).thenReturn(date);
        return transaction;
    }
}
