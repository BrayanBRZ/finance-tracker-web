package com.financetracker.api.dto.category;

import com.financetracker.api.enums.TransactionType;

public record CategoryResponse(Long id, String name, TransactionType type, String color, String icon) {
}
