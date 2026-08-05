package com.financetracker.api.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateUserRequest(
    @NotBlank(message = "Nome é obrigatório") @Size(min = 2, max = 120) String name,
    @NotBlank(message = "E-mail é obrigatório") @Email(message = "Formato de e-mail inválido") String email
) {
}
