package com.financetracker.api.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.financetracker.api.Routes;
import com.financetracker.api.dto.category.CategoryRequest;
import com.financetracker.api.dto.category.CategoryResponse;
import com.financetracker.api.enums.TransactionType;
import com.financetracker.api.security.AuthenticatedUser;
import com.financetracker.api.service.CategoryService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;

@RestController
@RequestMapping(Routes.Categories.BASE)
@SecurityRequirement(name = "bearerAuth")
public class CategoryController {
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    List<CategoryResponse> list(
            @AuthenticationPrincipal AuthenticatedUser user,
            @RequestParam(required = false) TransactionType type) {
        return categoryService.list(user.id(), type);
    }

    @PostMapping
    ResponseEntity<CategoryResponse> create(
            @AuthenticationPrincipal AuthenticatedUser user,
            @Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryService.create(user.id(), request));
    }

    @PutMapping(Routes.Categories.BY_ID)
    CategoryResponse update(
            @AuthenticationPrincipal AuthenticatedUser user,
            @PathVariable("categoryId") Long categoryId,
            @Valid @RequestBody CategoryRequest request) {
        return categoryService.update(user.id(), categoryId, request);
    }

    @DeleteMapping(Routes.Categories.BY_ID)
    ResponseEntity<Void> delete(
            @AuthenticationPrincipal AuthenticatedUser user,
            @PathVariable("categoryId") Long categoryId) {
        categoryService.delete(user.id(), categoryId);
        return ResponseEntity.noContent().build();
    }
}
