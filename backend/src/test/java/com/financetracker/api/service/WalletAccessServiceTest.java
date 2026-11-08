package com.financetracker.api.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.springframework.http.HttpStatus;

import com.financetracker.api.entity.User;
import com.financetracker.api.entity.Wallet;
import com.financetracker.api.entity.WalletMember;
import com.financetracker.api.enums.WalletRole;
import com.financetracker.api.exception.ApiException;
import com.financetracker.api.repository.WalletMemberRepository;
import com.financetracker.api.repository.WalletRepository;

class WalletAccessServiceTest {
    private final WalletRepository wallets = mock(WalletRepository.class);
    private final WalletMemberRepository members = mock(WalletMemberRepository.class);
    private final WalletAccessService access = new WalletAccessService(wallets, members);
    private final UUID walletId = UUID.randomUUID();

    private void membership(WalletRole role) {
        Wallet wallet = mock(Wallet.class);
        when(wallet.getId()).thenReturn(7L);
        when(wallets.findByUuid(walletId)).thenReturn(Optional.of(wallet));
        when(members.findByWalletIdAndUserId(7L, 42L)).thenReturn(role == null ? Optional.empty()
                : Optional.of(new WalletMember(wallet, mock(User.class), role)));
    }

    @Test
    void knowingAWalletUuidDoesNotGrantAccess() {
        membership(null);
        assertEquals(HttpStatus.FORBIDDEN, assertThrows(ApiException.class,
                () -> access.requireMember(walletId, 42L)).getStatus());
    }

    @Test
    void viewersCanReadButCannotChangeTransactionsOrManageTheWallet() {
        membership(WalletRole.VIEWER);
        assertNotNull(access.requireMember(walletId, 42L));
        assertEquals(HttpStatus.FORBIDDEN, assertThrows(ApiException.class,
                () -> access.requireEditor(walletId, 42L)).getStatus());
        assertEquals(HttpStatus.FORBIDDEN, assertThrows(ApiException.class,
                () -> access.requireOwner(walletId, 42L)).getStatus());
    }

    @ParameterizedTest
    @EnumSource(value = WalletRole.class, names = { "EDITOR", "OWNER" })
    void editorsCanChangeTransactionsButOnlyOwnersCanManageTheWallet(WalletRole role) {
        membership(role);
        assertNotNull(access.requireEditor(walletId, 42L));
        if (role == WalletRole.OWNER) assertNotNull(access.requireOwner(walletId, 42L));
        else assertEquals(HttpStatus.FORBIDDEN, assertThrows(ApiException.class,
                () -> access.requireOwner(walletId, 42L)).getStatus());
    }
}
