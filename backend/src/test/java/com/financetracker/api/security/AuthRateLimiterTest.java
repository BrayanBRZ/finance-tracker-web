package com.financetracker.api.security;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.Clock;
import java.time.Instant;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import org.junit.jupiter.api.Test;

class AuthRateLimiterTest {
    @Test
    void limitsAreIsolatedAndExpireWithoutExtendingTheBlockOnRetries() {
        Clock clock = mock(Clock.class);
        Instant start = Instant.parse("2026-11-08T12:00:00Z");
        when(clock.instant()).thenReturn(start);
        var limiter = new AuthRateLimiter(2, 60, 10, clock);
        assertEquals(0, limiter.retryAfter("client-a", "login"));
        assertEquals(0, limiter.retryAfter("client-a", "login"));
        assertEquals(60, limiter.retryAfter("client-a", "login"));
        assertEquals(0, limiter.retryAfter("client-b", "login"));
        assertEquals(0, limiter.retryAfter("client-a", "reset"));
        when(clock.instant()).thenReturn(start.plusMillis(59501));
        assertEquals(1, limiter.retryAfter("client-a", "login"));
        when(clock.instant()).thenReturn(start.plusSeconds(60));
        assertEquals(0, limiter.retryAfter("client-a", "login"));
    }

    @Test
    void capacityDoesNotEvictActiveLimitsAndExpiredEntriesAreReclaimed() {
        Clock clock = mock(Clock.class);
        Instant start = Instant.parse("2026-11-08T12:00:00Z");
        when(clock.instant()).thenReturn(start);
        var limiter = new AuthRateLimiter(1, 60, 1, clock);
        assertEquals(0, limiter.retryAfter("client-a", "login"));
        assertEquals(60, limiter.retryAfter("client-b", "login"));
        assertEquals(60, limiter.retryAfter("client-a", "login"));
        when(clock.instant()).thenReturn(start.plusSeconds(60));
        assertEquals(0, limiter.retryAfter("client-b", "login"));
    }

    @Test
    void concurrentRequestsCannotExceedTheLimit() throws Exception {
        var limiter = new AuthRateLimiter(10, 60, 100);
        AtomicInteger accepted = new AtomicInteger();
        try (var executor = Executors.newFixedThreadPool(8)) {
            for (int i = 0; i < 100; i++) {
                executor.submit(() -> {
                    if (limiter.retryAfter("same-client", "login") == 0) accepted.incrementAndGet();
                });
            }
            executor.shutdown();
            assertTrue(executor.awaitTermination(5, TimeUnit.SECONDS));
        }
        assertEquals(10, accepted.get());
    }
}
