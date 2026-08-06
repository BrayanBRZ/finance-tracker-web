package com.financetracker.api.repository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.financetracker.api.dto.transaction.TransactionFilter;
import com.financetracker.api.entity.Transaction;

import jakarta.persistence.criteria.Predicate;

public final class TransactionSpecifications {
    private TransactionSpecifications() {
    }

    public static Specification<Transaction> byWalletAndFilter(Long walletId, TransactionFilter filter) {
        return byWalletAndPeriod(walletId, filter.startDate(), filter.endDate())
                .and((root, query, builder) -> {
                    List<Predicate> predicates = new ArrayList<>();
                    if (filter.type() != null) {
                        predicates.add(builder.equal(root.get("type"), filter.type()));
                    }
                    if (filter.categoryId() != null) {
                        predicates.add(builder.equal(root.get("category").get("id"), filter.categoryId()));
                    }
                    return builder.and(predicates.toArray(Predicate[]::new));
                });
    }

    public static Specification<Transaction> byWalletAndPeriod(Long walletId, LocalDate startDate, LocalDate endDate) {
        return (root, query, builder) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(builder.equal(root.get("wallet").get("id"), walletId));
            if (startDate != null) {
                predicates.add(builder.greaterThanOrEqualTo(root.get("transactionDate"), startDate));
            }
            if (endDate != null) {
                predicates.add(builder.lessThanOrEqualTo(root.get("transactionDate"), endDate));
            }
            return builder.and(predicates.toArray(Predicate[]::new));
        };
    }
}
