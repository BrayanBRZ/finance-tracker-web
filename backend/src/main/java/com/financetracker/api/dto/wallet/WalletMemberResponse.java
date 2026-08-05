package com.financetracker.api.dto.wallet;

import com.financetracker.api.dto.user.UserSummaryResponse;
import com.financetracker.api.enums.WalletRole;
import java.time.LocalDateTime;

public record WalletMemberResponse(
    Long id,
    UserSummaryResponse user,
    WalletRole role,
    LocalDateTime joinedAt
) {
}
