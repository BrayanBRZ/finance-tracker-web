package com.financetracker.api.dto.category;

import com.financetracker.api.enums.TransactionType;

public record CategoryFilter(TransactionType type) {
}
