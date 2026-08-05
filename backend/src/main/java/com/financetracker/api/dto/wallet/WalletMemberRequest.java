package com.financetracker.api.dto.wallet;

import com.financetracker.api.enums.WalletRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record WalletMemberRequest(
    @NotBlank(message = "E-mail é obrigatório") @Email(message = "Formato de e-mail inválido") String email,
    @NotNull(message = "Papel é obrigatório") WalletRole role
) {
}
