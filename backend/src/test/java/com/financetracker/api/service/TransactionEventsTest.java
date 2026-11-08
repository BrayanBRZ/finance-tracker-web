package com.financetracker.api.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.context.ApplicationEventPublisher;

import com.financetracker.api.dto.transaction.TransactionRequest;
import com.financetracker.api.entity.Transaction;
import com.financetracker.api.entity.User;
import com.financetracker.api.entity.Wallet;
import com.financetracker.api.entity.WalletMember;
import com.financetracker.api.enums.TransactionType;
import com.financetracker.api.repository.CategoryRepository;
import com.financetracker.api.repository.TransactionRepository;

class TransactionEventsTest {
    @Test
    void everyTransactionMutationPublishesAnEventForItsWallet() {
        TransactionRepository transactions = mock(TransactionRepository.class);
        CategoryRepository categories = mock(CategoryRepository.class);
        WalletAccessService walletAccess = mock(WalletAccessService.class);
        ApplicationEventPublisher events = mock(ApplicationEventPublisher.class);
        TransactionService service = new TransactionService(transactions, categories, walletAccess, events);
        UUID walletId = UUID.randomUUID();
        UUID transactionId = UUID.randomUUID();
        Wallet wallet = mock(Wallet.class);
        User user = mock(User.class);
        WalletMember member = mock(WalletMember.class);
        TransactionRequest request = new TransactionRequest(
                TransactionType.EXPENSE, BigDecimal.ONE, "Compra", LocalDate.now(), null);
        Transaction transaction = new Transaction(
                wallet, null, user, request.type(), request.amount(), request.description(), request.date());

        when(wallet.getId()).thenReturn(11L);
        when(member.getWallet()).thenReturn(wallet);
        when(member.getUser()).thenReturn(user);
        when(walletAccess.requireEditor(walletId, 7L)).thenReturn(member);
        when(transactions.save(any(Transaction.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(transactions.findByUuidAndWalletId(transactionId, 11L)).thenReturn(Optional.of(transaction));

        service.create(7L, walletId, request);
        service.update(7L, walletId, transactionId, request);
        service.delete(7L, walletId, transactionId);

        verify(events, times(3)).publishEvent(new WalletTransactionChanged(11L));
    }
}
