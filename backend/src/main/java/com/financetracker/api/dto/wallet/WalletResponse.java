package com.financetracker.api.dto.wallet;

import com.financetracker.api.dto.user.UserSummaryResponse;
import com.financetracker.api.enums.WalletRole;
import java.time.Instant;
import java.util.UUID;

public record WalletResponse(
    UUID id,
    String name,
    String description,
    UserSummaryResponse owner,
    WalletRole currentUserRole,
    Instant createdAt
) {
}
