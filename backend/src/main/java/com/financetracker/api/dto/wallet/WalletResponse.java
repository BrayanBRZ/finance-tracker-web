package com.financetracker.api.dto.wallet;

import com.financetracker.api.dto.user.UserSummaryResponse;
import com.financetracker.api.enums.WalletRole;
import java.time.LocalDateTime;

public record WalletResponse(
    Long id,
    String name,
    String description,
    UserSummaryResponse owner,
    WalletRole currentUserRole,
    LocalDateTime createdAt
) {
}
