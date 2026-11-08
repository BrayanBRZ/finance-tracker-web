package com.financetracker.api.service;

import java.time.Clock;
import java.time.Instant;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import com.financetracker.api.config.InsightConfig.Settings;
import com.financetracker.api.exception.ApiException;

/** Bounded limits for one application instance; cached and empty results do not consume requests. */
@Component
public class InsightRequestGuard {
    private final Map<String, Window> windows = new HashMap<>();
    private final Set<String> inFlight = new HashSet<>();
    private final Settings settings;
    private final Clock clock;

    public InsightRequestGuard(Settings settings, Clock clock) {
        this.settings = settings;
        this.clock = clock;
    }

    public synchronized void begin(Long userId, UUID walletId, String snapshotKey) {
        Instant now = clock.instant();
        windows.values().removeIf(window -> !window.started.plusSeconds(60).isAfter(now));
        String userKey = "user:" + userId;
        String walletKey = "wallet:" + walletId;
        if (inFlight.contains(snapshotKey)) {
            throw new ApiException(HttpStatus.TOO_MANY_REQUESTS, "Uma análise deste período já está sendo gerada. Aguarde e tente novamente.");
        }
        if (inFlight.size() >= 4 || windows.size() >= 10000
                || count(userKey) >= Math.max(1, settings.requestsPerMinute())
                || count(walletKey) >= Math.max(1, settings.walletRequestsPerMinute())) {
            throw new ApiException(HttpStatus.TOO_MANY_REQUESTS, "Limite de análises atingido. Aguarde um minuto e tente novamente.");
        }
        windows.computeIfAbsent(userKey, ignored -> new Window(now)).count++;
        windows.computeIfAbsent(walletKey, ignored -> new Window(now)).count++;
        inFlight.add(snapshotKey);
    }

    public synchronized void end(String snapshotKey) {
        inFlight.remove(snapshotKey);
    }

    private int count(String key) {
        Window window = windows.get(key);
        return window == null ? 0 : window.count;
    }

    private static class Window {
        private final Instant started;
        private int count;
        Window(Instant started) { this.started = started; }
    }
}
