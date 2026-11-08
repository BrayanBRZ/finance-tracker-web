package com.financetracker.api.security;

import java.time.Clock;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/** Fixed windows, bounded memory and limits per client/operation for one API instance. */
@Component
public class AuthRateLimiter {
    private final int maxRequests;
    private final int windowSeconds;
    private final int maxEntries;
    private final Clock clock;
    private final Map<ClientOperation, Window> windows = new HashMap<>();

    @Autowired
    public AuthRateLimiter(
            @Value("${app.auth.rate-limit.max-requests:10}") int maxRequests,
            @Value("${app.auth.rate-limit.window-seconds:60}") int windowSeconds,
            @Value("${app.auth.rate-limit.max-entries:10000}") int maxEntries) {
        this(maxRequests, windowSeconds, maxEntries, Clock.systemUTC());
    }

    AuthRateLimiter(int maxRequests, int windowSeconds, int maxEntries, Clock clock) {
        if (maxRequests < 1 || windowSeconds < 1 || maxEntries < 1) {
            throw new IllegalArgumentException("Os limites de autenticação devem ser positivos");
        }
        this.maxRequests = maxRequests;
        this.windowSeconds = windowSeconds;
        this.maxEntries = maxEntries;
        this.clock = clock;
    }

    /** Returns zero when allowed, otherwise seconds until a retry is permitted. */
    public synchronized long retryAfter(String client, String operation) {
        Instant now = clock.instant();
        ClientOperation key = new ClientOperation(client, operation);
        Window window = windows.get(key);
        if (window != null && !window.expiresAt().isAfter(now)) {
            windows.remove(key);
            window = null;
        }
        if (window == null) {
            // Clean up on insertion, keeping both storage and attacker-controlled keys bounded.
            windows.values().removeIf(value -> !value.expiresAt().isAfter(now));
            if (windows.size() >= maxEntries) {
                return windowSeconds; // Fail closed rather than evicting active clients and bypassing limits.
            }
            windows.put(key, new Window(now.plusSeconds(windowSeconds), 1));
            return 0;
        }
        if (window.requests() >= maxRequests) {
            long millis = window.expiresAt().toEpochMilli() - now.toEpochMilli();
            return Math.max(1, (millis + 999) / 1000);
        }
        windows.put(key, new Window(window.expiresAt(), window.requests() + 1));
        return 0;
    }

    private record ClientOperation(String client, String operation) {}
    private record Window(Instant expiresAt, int requests) {}
}
