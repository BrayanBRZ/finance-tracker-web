package com.financetracker.api.dto.category;

import java.util.UUID;

import com.financetracker.api.enums.TransactionType;

public record CategoryResponse(UUID id, String name, TransactionType type, String color, String icon) {
}
