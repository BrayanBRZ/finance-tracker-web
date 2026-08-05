package com.financetracker.api.dto.transaction;

import com.financetracker.api.dto.category.CategoryResponse;
import com.financetracker.api.dto.user.UserSummaryResponse;
import com.financetracker.api.enums.TransactionType;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record TransactionResponse(
    Long id,
    Long walletId,
    CategoryResponse category,
    UserSummaryResponse createdBy,
    TransactionType type,
    BigDecimal amount,
    String description,
    LocalDate date,
    LocalDateTime createdAt
) {
}
