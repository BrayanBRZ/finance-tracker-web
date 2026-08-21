package com.financetracker.api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.domain.Specification;

import com.financetracker.api.entity.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long>, JpaSpecificationExecutor<Transaction> {
    @Override
    @EntityGraph(attributePaths = { "wallet", "category", "createdBy" })
    Page<Transaction> findAll(Specification<Transaction> specification, Pageable pageable);

    @Override
    @EntityGraph(attributePaths = "category")
    List<Transaction> findAll(Specification<Transaction> specification);

    boolean existsByCategoryId(Long categoryId);

    Optional<Transaction> findByIdAndWalletId(Long id, Long walletId);
}
