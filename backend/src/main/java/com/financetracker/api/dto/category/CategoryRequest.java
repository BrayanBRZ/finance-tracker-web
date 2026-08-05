package com.financetracker.api.dto.category;

import com.financetracker.api.enums.TransactionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CategoryRequest(
    @NotBlank(message = "Nome é obrigatório") @Size(max = 80) String name,
    @NotNull(message = "Tipo é obrigatório") TransactionType type,
    @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "Cor deve estar no formato hexadecimal #RRGGBB") String color,
    @Size(max = 120, message = "Ícone deve ter no máximo 120 caracteres") String icon
) {
}
