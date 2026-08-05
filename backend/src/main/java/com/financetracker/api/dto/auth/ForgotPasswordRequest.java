package com.financetracker.api.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ForgotPasswordRequest(
    @NotBlank(message = "E-mail é obrigatório") @Email(message = "Formato de e-mail inválido") String email
) {
}
