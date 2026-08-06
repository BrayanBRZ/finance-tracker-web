package com.financetracker.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.financetracker.api.entity.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    boolean existsByCategoryId(Long categoryId);
}
