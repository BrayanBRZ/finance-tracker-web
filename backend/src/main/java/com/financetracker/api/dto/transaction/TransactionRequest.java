package com.financetracker.api.dto.transaction;

import com.financetracker.api.enums.TransactionType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionRequest(
    @NotNull(message = "Tipo é obrigatório") TransactionType type,
    @NotNull(message = "Valor é obrigatório") @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero") BigDecimal amount,
    @Size(max = 500, message = "Descrição deve ter no máximo 500 caracteres") String description,
    @NotNull(message = "Data é obrigatória") @PastOrPresent(message = "Data não pode estar no futuro") LocalDate date,
    Long categoryId
) {
}
