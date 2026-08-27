package com.financetracker.api.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.UUID;

import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import com.financetracker.api.entity.User;
import com.financetracker.api.entity.Wallet;
import com.financetracker.api.entity.WalletMember;
import com.financetracker.api.enums.WalletRole;
import com.financetracker.api.exception.ApiException;
import com.financetracker.api.repository.WalletMemberRepository;

@ExtendWith(MockitoExtension.class)
class WalletMemberServiceTest {
    @Mock
    private WalletMemberRepository walletMemberRepository;

    @Mock
    private UserAccessService userAccessService;

    @Mock
    private WalletAccessService walletAccess;

    @InjectMocks
    private WalletMemberService walletMemberService;

    @ParameterizedTest
    @EnumSource(value = WalletRole.class, names = { "EDITOR", "VIEWER" })
    void leaveDeletesAuthenticatedNonOwnerMembership(WalletRole role) {
        Long requesterId = 42L;
        UUID walletId = UUID.randomUUID();
        WalletMember member = memberWithRole(role);
        when(walletAccess.requireMember(walletId, requesterId)).thenReturn(member);

        walletMemberService.leave(requesterId, walletId);

        verify(walletMemberRepository).delete(member);
    }

    @Test
    void leaveRejectsOwnerMembership() {
        Long requesterId = 42L;
        UUID walletId = UUID.randomUUID();
        WalletMember member = memberWithRole(WalletRole.OWNER);
        when(walletAccess.requireMember(walletId, requesterId)).thenReturn(member);

        ApiException exception = assertThrows(
                ApiException.class,
                () -> walletMemberService.leave(requesterId, walletId));

        assertEquals(HttpStatus.UNPROCESSABLE_ENTITY, exception.getStatus());
        verify(walletMemberRepository, never()).delete(member);
    }

    private WalletMember memberWithRole(WalletRole role) {
        return new WalletMember(mock(Wallet.class), mock(User.class), role);
    }
}
