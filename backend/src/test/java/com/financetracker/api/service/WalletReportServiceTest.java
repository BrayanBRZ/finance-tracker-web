package com.financetracker.api.service;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import com.financetracker.api.dto.summary.WalletSummaryResponse;
import com.financetracker.api.entity.Wallet;
import com.financetracker.api.entity.WalletMember;
import com.financetracker.api.enums.WalletRole;
import com.financetracker.api.exception.ApiException;

@ExtendWith(MockitoExtension.class)
class WalletReportServiceTest {
    @Mock private WalletSummaryService summaryService;
    @Mock private WalletAccessService walletAccess;
    @Mock private PdfSummaryRenderer renderer;
    @InjectMocks private WalletReportService reportService;

    @Test
    void viewerCanDownloadReportForOwnWallet() throws IOException {
        long userId = 42L;
        UUID walletId = UUID.randomUUID();
        LocalDate start = LocalDate.of(2026, 9, 1);
        LocalDate end = LocalDate.of(2026, 9, 30);
        Wallet wallet = org.mockito.Mockito.mock(Wallet.class);
        WalletMember member = org.mockito.Mockito.mock(WalletMember.class);
        WalletSummaryResponse summary = new WalletSummaryResponse(
                BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, 0, List.of(), List.of(), List.of());
        when(member.getRole()).thenReturn(WalletRole.VIEWER);
        when(member.getWallet()).thenReturn(wallet);
        when(wallet.getName()).thenReturn("Compartilhada");
        when(walletAccess.requireMember(walletId, userId)).thenReturn(member);
        when(summaryService.get(userId, walletId, start, end)).thenReturn(summary);
        when(renderer.render("Compartilhada", start, end, summary)).thenReturn(new byte[] { 1, 2, 3 });

        assertEquals(WalletRole.VIEWER, member.getRole());
        assertArrayEquals(new byte[] { 1, 2, 3 }, reportService.generate(userId, walletId, start, end));
        verify(walletAccess).requireMember(walletId, userId);
    }

    @Test
    void rejectsNonMemberAndInvertedDates() {
        long userId = 42L;
        UUID walletId = UUID.randomUUID();
        LocalDate start = LocalDate.of(2026, 9, 1);
        LocalDate end = LocalDate.of(2026, 9, 30);
        when(walletAccess.requireMember(walletId, userId))
                .thenThrow(new ApiException(HttpStatus.FORBIDDEN, "Sem acesso"));

        ApiException denied = assertThrows(ApiException.class,
                () -> reportService.generate(userId, walletId, start, end));
        assertEquals(HttpStatus.FORBIDDEN, denied.getStatus());
        ApiException invalid = assertThrows(ApiException.class,
                () -> reportService.generate(userId, walletId, end, start));
        assertEquals(HttpStatus.BAD_REQUEST, invalid.getStatus());
    }
}
