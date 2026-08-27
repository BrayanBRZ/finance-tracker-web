package com.financetracker.api.dto.user;

import java.util.UUID;

public record UserSummaryResponse(UUID id, String name, String email) {
}
