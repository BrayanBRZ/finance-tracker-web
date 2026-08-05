package com.financetracker.api.dto.summary;

import java.math.BigDecimal;

public record CategoryTotalResponse(Long categoryId, String categoryName, BigDecimal total) {
}
