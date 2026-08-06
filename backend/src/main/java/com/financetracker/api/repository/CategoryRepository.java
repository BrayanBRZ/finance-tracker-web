package com.financetracker.api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.financetracker.api.entity.Category;
import com.financetracker.api.enums.TransactionType;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findAllByUserIdOrderByNameAsc(Long userId);

    List<Category> findAllByUserIdAndTypeOrderByNameAsc(Long userId, TransactionType type);

    Optional<Category> findByIdAndUserId(Long id, Long userId);
}
