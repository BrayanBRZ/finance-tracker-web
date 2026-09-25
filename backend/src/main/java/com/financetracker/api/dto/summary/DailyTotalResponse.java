package com.financetracker.api.dto.summary;

import java.math.BigDecimal;
import java.time.LocalDate;

public record DailyTotalResponse(LocalDate date, BigDecimal income, BigDecimal expense) {
}
