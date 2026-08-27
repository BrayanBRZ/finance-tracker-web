package com.financetracker.api.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.financetracker.api.entity.Category;
import com.financetracker.api.enums.TransactionType;

public interface CategoryRepository extends BaseRepository<Category> {
    List<Category> findAllByUserIdOrderByNameAsc(Long userId);

    List<Category> findAllByUserIdAndTypeOrderByNameAsc(Long userId, TransactionType type);

    Optional<Category> findByUuidAndUserId(UUID categoryId, Long userId);
}
