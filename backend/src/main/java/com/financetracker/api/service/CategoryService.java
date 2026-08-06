package com.financetracker.api.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.financetracker.api.dto.category.CategoryRequest;
import com.financetracker.api.dto.category.CategoryResponse;
import com.financetracker.api.entity.Category;
import com.financetracker.api.entity.User;
import com.financetracker.api.enums.TransactionType;
import com.financetracker.api.exception.ApiException;
import com.financetracker.api.mapper.CategoryMapper;
import com.financetracker.api.repository.CategoryRepository;
import com.financetracker.api.repository.TransactionRepository;
import com.financetracker.api.repository.UserRepository;

@Service
public class CategoryService {
    private final CategoryRepository categories;
    private final TransactionRepository transactions;
    private final UserRepository users;

    public CategoryService(
            CategoryRepository categories,
            TransactionRepository transactions,
            UserRepository users) {
        this.categories = categories;
        this.transactions = transactions;
        this.users = users;
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> list(Long userId, TransactionType type) {
        List<Category> categoriesForUser = type == null
                ? categories.findAllByUserIdOrderByNameAsc(userId)
                : categories.findAllByUserIdAndTypeOrderByNameAsc(userId, type);

        return categoriesForUser.stream().map(CategoryMapper::toResponse).toList();
    }

    @Transactional
    public CategoryResponse create(Long userId, CategoryRequest request) {
        User user = requireUser(userId);
        Category category = categories.save(new Category(
                user,
                request.name().trim(),
                request.type(),
                request.color(),
                request.icon()));
        return CategoryMapper.toResponse(category);
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
        if (transactions.existsByCategoryId(categoryId)) {
            throw new ApiException(
                    HttpStatus.UNPROCESSABLE_ENTITY,
                    "Não é possível excluir uma categoria com transações vinculadas");
        }
        categories.delete(category);
    }

    private Category requireCategory(Long categoryId, Long userId) {
        return categories.findByIdAndUserId(categoryId, userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Categoria não encontrada"));
    }

    private User requireUser(Long userId) {
        return users.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
    }
}
