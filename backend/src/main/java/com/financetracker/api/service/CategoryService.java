package com.financetracker.api.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.financetracker.api.dto.category.CategoryRequest;
import com.financetracker.api.dto.category.CategoryResponse;
import com.financetracker.api.entity.Category;
import com.financetracker.api.enums.TransactionType;
import com.financetracker.api.exception.ApiException;
import com.financetracker.api.mapper.CategoryMapper;
import com.financetracker.api.repository.CategoryRepository;
import com.financetracker.api.repository.TransactionRepository;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final TransactionRepository transactionRepository;
    private final UserAccessService userAccessService;

    public CategoryService(
            CategoryRepository categoryRepository,
            TransactionRepository transactionRepository,
            UserAccessService userAccessService) {
        this.categoryRepository = categoryRepository;
        this.transactionRepository = transactionRepository;
        this.userAccessService = userAccessService;
    }

    @Transactional
    public CategoryResponse create(Long userId, CategoryRequest request) {
        Category category = categoryRepository.save(new Category(
                userAccessService.requireUser(userId),
                request.name().trim(),
                request.type(),
                request.color(),
                request.icon()));
        return CategoryMapper.toResponse(category);
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> list(Long userId, TransactionType type) {
        List<Category> categoriesForUser = type == null
                ? categoryRepository.findAllByUserIdOrderByNameAsc(userId)
                : categoryRepository.findAllByUserIdAndTypeOrderByNameAsc(userId, type);

        return categoriesForUser.stream().map(CategoryMapper::toResponse).toList();
    }

    @Transactional
    public CategoryResponse update(Long userId, Long categoryId, CategoryRequest request) {
        Category category = requireCategory(categoryId, userId);
        category.update(request.name().trim(), request.type(), request.color(), request.icon());
        return CategoryMapper.toResponse(category);
    }

    @Transactional
    public void delete(Long userId, Long categoryId) {
        Category category = requireCategory(categoryId, userId);
        if (transactionRepository.existsByCategoryId(categoryId)) {
            throw new ApiException(
                    HttpStatus.UNPROCESSABLE_ENTITY,
                    "Não é possível excluir uma categoria com transações vinculadas");
        }
        categoryRepository.delete(category);
    }

    private Category requireCategory(Long categoryId, Long userId) {
        return categoryRepository.findByIdAndUserId(categoryId, userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Categoria não encontrada"));
    }
}
