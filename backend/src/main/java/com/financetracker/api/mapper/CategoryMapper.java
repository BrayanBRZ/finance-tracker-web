package com.financetracker.api.mapper;

import com.financetracker.api.dto.category.CategoryResponse;
import com.financetracker.api.entity.Category;

public final class CategoryMapper {
    private CategoryMapper() {
    }

    public static CategoryResponse toResponse(Category category) {
        return new CategoryResponse(
                category.getUuid(),
                category.getName(),
                category.getType(),
                category.getColor(),
                category.getIcon());
    }
}
