package com.financetracker.api.mapper;

import com.financetracker.api.dto.transaction.TransactionResponse;
import com.financetracker.api.entity.Transaction;

public final class TransactionMapper {
    private TransactionMapper() {
    }

    public static TransactionResponse toResponse(Transaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getWallet().getId(),
                transaction.getCategory() == null ? null : CategoryMapper.toResponse(transaction.getCategory()),
                UserMapper.toSummary(transaction.getCreatedBy()),
                transaction.getType(),
                transaction.getAmount(),
                transaction.getDescription(),
                transaction.getTransactionDate(),
                transaction.getCreatedAt());
    }
}
