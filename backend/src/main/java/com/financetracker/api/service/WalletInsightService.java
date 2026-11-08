package com.financetracker.api.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Clock;
import java.time.Instant;
import java.util.HexFormat;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.financetracker.api.config.InsightConfig.Settings;
import com.financetracker.api.dto.insight.InsightContent;
import com.financetracker.api.dto.insight.InsightContext;
import com.financetracker.api.dto.insight.InsightRequest;
import com.financetracker.api.dto.insight.InsightResponse;
import com.financetracker.api.exception.ApiException;

@Service
public class WalletInsightService {
    private final WalletInsightContextService contexts;
    private final FinancialInsightProvider provider;
    private final InsightRequestGuard guard;
    private final Settings settings;
    private final ObjectMapper mapper;
    private final Clock clock;
    private final Map<String, InsightResponse> cache = new LinkedHashMap<>();

    public WalletInsightService(WalletInsightContextService contexts, FinancialInsightProvider provider,
            InsightRequestGuard guard, Settings settings, ObjectMapper mapper, Clock clock) {
        this.contexts = contexts;
        this.provider = provider;
        this.guard = guard;
        this.settings = settings;
        this.mapper = mapper;
        this.clock = clock;
    }

    // The context service's DB transaction has already closed when the external HTTP request starts.
    public InsightResponse generate(Long userId, UUID walletId, InsightRequest request) {
        InsightContext context = contexts.load(userId, walletId, request);
        if (context.transactionCount() == 0) {
            return new InsightResponse(request.startDate(), request.endDate(), clock.instant(), true, false, null);
        }
        if (!settings.configured()) {
            throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE, "A análise por IA ainda não está configurada");
        }
        String key = walletId + ":" + fingerprint(context);
        InsightResponse cached = cached(key);
        if (cached != null) return cached;
        guard.begin(userId, walletId, key);
        try {
            // A previous request might have completed between our first cache lookup and acquiring the guard.
            cached = cached(key);
            if (cached != null) return cached;
            InsightContent analysis = provider.generate(context);
            // A member may have been removed while the model was running. Recheck before returning/storing data.
            InsightContext latest = contexts.load(userId, walletId, request);
            if (!fingerprint(context).equals(fingerprint(latest))) {
                throw new ApiException(HttpStatus.CONFLICT, "Os dados mudaram durante a geração. Gere uma nova análise.");
            }
            InsightResponse response = new InsightResponse(request.startDate(), request.endDate(), clock.instant(),
                    false, false, analysis);
            synchronized (cache) {
                if (cache.size() >= 256) cache.remove(cache.keySet().iterator().next());
                cache.put(key, response);
            }
            return response;
        } finally {
            guard.end(key);
        }
    }

    private InsightResponse cached(String key) {
        synchronized (cache) {
            Instant now = clock.instant();
            cache.values().removeIf(value -> !value.generatedAt().plusSeconds(600).isAfter(now));
            InsightResponse found = cache.get(key);
            return found == null ? null : found.fromCache();
        }
    }

    private String fingerprint(InsightContext context) {
        try {
            String input = "insight-v1:" + settings.model() + ":" + mapper.writeValueAsString(context);
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256")
                    .digest(input.getBytes(StandardCharsets.UTF_8)));
        } catch (JsonProcessingException | NoSuchAlgorithmException exception) {
            throw new IllegalStateException("Não foi possível preparar a análise financeira", exception);
        }
    }
}
