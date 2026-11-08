package com.financetracker.api.dto.insight;

import java.time.Instant;
import java.time.LocalDate;

public record InsightResponse(LocalDate startDate, LocalDate endDate, Instant generatedAt,
        boolean empty, boolean cached, InsightContent analysis) {
    public InsightResponse fromCache() {
        return new InsightResponse(startDate, endDate, generatedAt, empty, true, analysis);
    }
}
