package com.financetracker.api.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import com.financetracker.api.validation.PasswordByteLength;

public record LoginRequest(
    @NotBlank(message = "E-mail é obrigatório") @Email(message = "Formato de e-mail inválido") @Size(max = 180) String email,
    @NotBlank(message = "Senha é obrigatória") @PasswordByteLength String password
) {
}
