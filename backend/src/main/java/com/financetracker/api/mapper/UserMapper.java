package com.financetracker.api.mapper;

import com.financetracker.api.dto.user.UserResponse;
import com.financetracker.api.entity.User;

public final class UserMapper {
    private UserMapper() {
    }

    public static UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getCreatedAt(),
                user.getUpdatedAt());
    }
}
