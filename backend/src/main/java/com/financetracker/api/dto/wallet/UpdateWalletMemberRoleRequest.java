package com.financetracker.api.dto.wallet;

import com.financetracker.api.enums.WalletRole;
import jakarta.validation.constraints.NotNull;

public record UpdateWalletMemberRoleRequest(
    @NotNull(message = "Papel é obrigatório") WalletRole role
) {
}
