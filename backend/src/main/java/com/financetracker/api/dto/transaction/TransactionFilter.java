package com.financetracker.api.dto.transaction;

import com.financetracker.api.enums.TransactionType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.time.LocalDate;

public record TransactionFilter(
    TransactionType type,
    Long categoryId,
    LocalDate startDate,
    LocalDate endDate,
    @Min(value = 0, message = "Página deve ser maior ou igual a zero") Integer page,
    @Min(value = 1, message = "Tamanho da página deve ser maior que zero") @Max(value = 100, message = "Tamanho da página deve ser no máximo 100") Integer size,
    String sort
) {
}
