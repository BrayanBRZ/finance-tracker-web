package com.financetracker.api.service;

import com.financetracker.api.dto.AuthDtos.UserResponse;
import com.financetracker.api.entity.User;

final class UserMapper {
    private UserMapper() {}

    static UserResponse toResponse(User user) {
        return new UserResponse(
            user.getId(), user.getName(), user.getEmail(),
            user.getCreatedAt(), user.getUpdatedAt()
        );
    }
}
