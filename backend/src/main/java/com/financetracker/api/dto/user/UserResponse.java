package com.financetracker.api.dto.user;

import java.time.Instant;
import java.util.UUID;

public record UserResponse(
    UUID id,
    String name,
    String email,
    Instant createdAt,
    Instant updatedAt
) {
}
