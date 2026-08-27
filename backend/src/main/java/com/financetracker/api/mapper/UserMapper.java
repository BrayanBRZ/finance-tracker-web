package com.financetracker.api.mapper;

import com.financetracker.api.dto.user.UserResponse;
import com.financetracker.api.dto.user.UserSummaryResponse;
import com.financetracker.api.entity.User;

public final class UserMapper {
    private UserMapper() {
    }

    public static UserResponse toResponse(User user) {
        return new UserResponse(
                user.getUuid(),
                user.getName(),
                user.getEmail(),
                user.getCreatedAt(),
                user.getUpdatedAt());
    }

    public static UserSummaryResponse toSummary(User user) {
        return new UserSummaryResponse(user.getUuid(), user.getName(), user.getEmail());
    }
}
