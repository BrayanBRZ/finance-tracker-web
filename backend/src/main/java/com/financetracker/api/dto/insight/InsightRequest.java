package com.financetracker.api.dto.insight;

import java.time.LocalDate;
import jakarta.validation.constraints.NotNull;

public record InsightRequest(
        @NotNull(message = "Data inicial é obrigatória") LocalDate startDate,
        @NotNull(message = "Data final é obrigatória") LocalDate endDate) {
}
