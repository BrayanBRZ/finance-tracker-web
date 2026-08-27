package com.financetracker.api.dto.summary;

import java.math.BigDecimal;
import java.util.UUID;

public record CategoryTotalResponse(UUID categoryId, String categoryName, BigDecimal total) {
}
