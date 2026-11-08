package com.financetracker.api.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import com.financetracker.api.dto.insight.InsightRequest;
import com.financetracker.api.entity.Category;
import com.financetracker.api.entity.Transaction;
import com.financetracker.api.entity.Wallet;
import com.financetracker.api.entity.WalletMember;
import com.financetracker.api.enums.TransactionType;
import com.financetracker.api.exception.ApiException;
import com.financetracker.api.repository.TransactionRepository;

class WalletInsightContextServiceTest {
    private final WalletAccessService access = mock(WalletAccessService.class);
    private final TransactionRepository repository = mock(TransactionRepository.class);
    private final WalletInsightContextService service = new WalletInsightContextService(access, repository);
    private final UUID walletId = UUID.randomUUID();
    private final LocalDate start = LocalDate.of(2026, 11, 1);

    private void authorize() {
        Wallet wallet = mock(Wallet.class);
        WalletMember member = mock(WalletMember.class);
        when(wallet.getId()).thenReturn(7L);
        when(member.getWallet()).thenReturn(wallet);
        when(access.requireMember(walletId, 42L)).thenReturn(member);
    }

    @Test
    void separatesExpensesFromIncomeAndComputesPercentagesWithoutPersonalData() {
        authorize();
        Category food = mock(Category.class);
        when(food.getName()).thenReturn("Alimentação");
        when(repository.findAll(org.mockito.ArgumentMatchers.<Specification<Transaction>>any())).thenReturn(List.of(
                entry(TransactionType.INCOME, "1000", food),
                entry(TransactionType.EXPENSE, "150", food),
                entry(TransactionType.EXPENSE, "50", null)));

        var result = service.load(42L, walletId, new InsightRequest(start, start.plusDays(29)));

        assertEquals(new BigDecimal("1000"), result.totalIncome());
        assertEquals(new BigDecimal("200"), result.totalExpense());
        assertEquals(new BigDecimal("800"), result.balance());
        assertEquals(3, result.transactionCount());
        assertEquals("Alimentação", result.expenseCategories().get(0).name());
        assertEquals(new BigDecimal("150"), result.expenseCategories().get(0).total());
        assertEquals(new BigDecimal("75.00"), result.expenseCategories().get(0).percentage());
        assertEquals("Sem categoria", result.expenseCategories().get(1).name());
        assertEquals(new BigDecimal("1000"), result.byMonth().get(0).income());
        assertEquals(new BigDecimal("200"), result.byMonth().get(0).expense());
    }

    @Test
    void rejectsNonMembersBeforeQueryingTransactions() {
        when(access.requireMember(walletId, 99L)).thenThrow(new ApiException(HttpStatus.FORBIDDEN, "Sem acesso"));
        assertEquals(HttpStatus.FORBIDDEN, assertThrows(ApiException.class,
                () -> service.load(99L, walletId, new InsightRequest(start, start))).getStatus());
        verifyNoInteractions(repository);
    }

    @Test
    void rejectsMissingReversedAndExcessivePeriodsBeforeQueryingTransactions() {
        authorize();
        for (InsightRequest request : List.of(new InsightRequest(null, start),
                new InsightRequest(start, start.minusDays(1)), new InsightRequest(start, start.plusDays(366)))) {
            assertEquals(HttpStatus.BAD_REQUEST, assertThrows(ApiException.class,
                    () -> service.load(42L, walletId, request)).getStatus());
        }
        verifyNoInteractions(repository);
    }

    private Transaction entry(TransactionType type, String amount, Category category) {
        return new Transaction(null, category, null, type, new BigDecimal(amount), "Não deve ser enviado", start);
    }
}
