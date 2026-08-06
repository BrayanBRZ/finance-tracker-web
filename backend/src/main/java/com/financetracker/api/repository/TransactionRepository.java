package com.financetracker.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.financetracker.api.entity.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long>, JpaSpecificationExecutor<Transaction> {
    boolean existsByCategoryId(Long categoryId);

    Optional<Transaction> findByIdAndWalletId(Long id, Long walletId);
}
