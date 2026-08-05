package com.financetracker.api.dto.wallet;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record WalletRequest(
    @NotBlank(message = "Nome é obrigatório") @Size(max = 120) String name,
    @Size(max = 500, message = "Descrição deve ter no máximo 500 caracteres") String description
) {
}
