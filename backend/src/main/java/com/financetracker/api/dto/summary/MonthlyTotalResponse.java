package com.financetracker.api.dto.summary;

import java.math.BigDecimal;

public record MonthlyTotalResponse(String month, BigDecimal income, BigDecimal expense) {
}
