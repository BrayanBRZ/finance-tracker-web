package com.financetracker.api.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.financetracker.api.config.InsightConfig.Settings;
import com.financetracker.api.dto.insight.*;
import com.financetracker.api.exception.ApiException;

class WalletInsightServiceTest {
    private final WalletInsightContextService contexts = mock(WalletInsightContextService.class);
    private final FinancialInsightProvider provider = mock(FinancialInsightProvider.class);
    private final Clock clock = Clock.fixed(Instant.parse("2026-11-08T12:00:00Z"), ZoneOffset.UTC);
    private final Settings settings = new Settings(true, "test-key", "test-model", 20, 3, 10);
    private final InsightRequestGuard guard = new InsightRequestGuard(settings, clock);
    private final WalletInsightService service = new WalletInsightService(contexts, provider, guard, settings,
            new ObjectMapper().findAndRegisterModules(), clock);
    private final UUID wallet = UUID.randomUUID();
    private final InsightRequest request = new InsightRequest(LocalDate.of(2026, 11, 1), LocalDate.of(2026, 11, 30));
    private final InsightContent content = new InsightContent("Resumo", List.of("Observação"), List.of("Sugestão"));

    @Test
    void authorizesEveryRequestAndReusesCacheUntilFinancialDataChanges() {
        when(contexts.load(42L, wallet, request)).thenReturn(context(1, "100"));
        when(provider.generate(any())).thenReturn(content);
        assertFalse(service.generate(42L, wallet, request).cached());
        assertTrue(service.generate(42L, wallet, request).cached());
        when(contexts.load(42L, wallet, request)).thenReturn(context(2, "200"));
        assertFalse(service.generate(42L, wallet, request).cached());
        verify(provider, times(2)).generate(any());
        when(contexts.load(42L, wallet, request)).thenThrow(new ApiException(HttpStatus.FORBIDDEN, "Removido"));
        assertEquals(HttpStatus.FORBIDDEN, assertThrows(ApiException.class,
                () -> service.generate(42L, wallet, request)).getStatus());
        verify(provider, times(2)).generate(any());
    }

    @Test
    void emptyPeriodsNeverCallProvider() {
        when(contexts.load(42L, wallet, request)).thenReturn(context(0, "0"));
        assertTrue(service.generate(42L, wallet, request).empty());
        verifyNoInteractions(provider);
    }

    @Test
    void expiresCacheAndDoesNotShareResultsAcrossWallets() {
        Clock moving = mock(Clock.class);
        when(moving.instant()).thenReturn(clock.instant());
        var expiring = new WalletInsightService(contexts, provider, new InsightRequestGuard(settings, moving), settings,
                new ObjectMapper().findAndRegisterModules(), moving);
        UUID otherWallet = UUID.randomUUID();
        when(contexts.load(eq(42L), any(UUID.class), eq(request))).thenReturn(context(1, "100"));
        when(provider.generate(any())).thenReturn(content);
        expiring.generate(42L, wallet, request);
        assertFalse(expiring.generate(42L, otherWallet, request).cached());
        when(moving.instant()).thenReturn(clock.instant().plusSeconds(601));
        assertFalse(expiring.generate(42L, wallet, request).cached());
        verify(provider, times(3)).generate(any());
    }

    @Test
    void missingConfigurationDoesNotCallProvider() {
        when(contexts.load(42L, wallet, request)).thenReturn(context(1, "100"));
        var disabled = new WalletInsightService(contexts, provider, guard,
                new Settings(false, "", "", 20, 3, 10), new ObjectMapper(), clock);
        assertEquals(HttpStatus.SERVICE_UNAVAILABLE, assertThrows(ApiException.class,
                () -> disabled.generate(42L, wallet, request)).getStatus());
        verifyNoInteractions(provider);
    }

    @Test
    void providerFailureIsNotCachedAndReleasesInFlightGuard() {
        when(contexts.load(42L, wallet, request)).thenReturn(context(1, "100"));
        when(provider.generate(any())).thenThrow(new ApiException(HttpStatus.SERVICE_UNAVAILABLE, "Indisponível"))
                .thenReturn(content);
        assertThrows(ApiException.class, () -> service.generate(42L, wallet, request));
        assertEquals(content, service.generate(42L, wallet, request).analysis());
    }

    @Test
    void rejectsDataChangedDuringGenerationAndDoesNotCacheStaleResult() {
        when(contexts.load(42L, wallet, request)).thenReturn(context(1, "100"), context(2, "200"));
        when(provider.generate(any())).thenReturn(content);
        assertEquals(HttpStatus.CONFLICT, assertThrows(ApiException.class,
                () -> service.generate(42L, wallet, request)).getStatus());
        assertFalse(service.generate(42L, wallet, request).cached());
        verify(provider, times(2)).generate(any());
    }

    @Test
    void rateLimitsAttemptsPerUserAndWalletAndBlocksDuplicateInFlightRequests() {
        guard.begin(42L, wallet, "first");
        assertEquals(HttpStatus.TOO_MANY_REQUESTS, assertThrows(ApiException.class,
                () -> guard.begin(99L, wallet, "first")).getStatus());
        guard.end("first");
        for (int i = 0; i < 2; i++) { guard.begin(42L, wallet, "next"); guard.end("next"); }
        assertEquals(HttpStatus.TOO_MANY_REQUESTS, assertThrows(ApiException.class,
                () -> guard.begin(42L, wallet, "last")).getStatus());
        InsightRequestGuard walletGuard = new InsightRequestGuard(new Settings(true, "key", "model", 20, 3, 1), clock);
        walletGuard.begin(42L, wallet, "one");
        walletGuard.end("one");
        assertEquals(HttpStatus.TOO_MANY_REQUESTS, assertThrows(ApiException.class,
                () -> walletGuard.begin(99L, wallet, "two")).getStatus());
    }

    private InsightContext context(long count, String expense) {
        BigDecimal amount = new BigDecimal(expense);
        return new InsightContext(request.startDate(), request.endDate(), "BRL", BigDecimal.ZERO,
                amount, amount.negate(), count, List.of(), List.of());
    }
}
