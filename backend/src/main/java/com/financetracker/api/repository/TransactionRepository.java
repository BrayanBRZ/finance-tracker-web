package com.financetracker.api.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.domain.Specification;

import com.financetracker.api.entity.Transaction;

public interface TransactionRepository extends BaseRepository<Transaction>, JpaSpecificationExecutor<Transaction> {
    @Override
    @EntityGraph(attributePaths = { "wallet", "category", "createdBy" })
    Page<Transaction> findAll(Specification<Transaction> specification, Pageable pageable);

    @Override
    @EntityGraph(attributePaths = "category")
    List<Transaction> findAll(Specification<Transaction> specification);

    List<Transaction> findAllByCategoryId(Long categoryId);

    Optional<Transaction> findByUuidAndWalletId(UUID transactionId, Long walletId);
}
