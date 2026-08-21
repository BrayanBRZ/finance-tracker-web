package com.financetracker.api.dto.auth;

import com.financetracker.api.validation.StrongPassword;

import jakarta.validation.constraints.NotBlank;

public record ResetPasswordRequest(
    @NotBlank(message = "Token é obrigatório") String token,
    @NotBlank(message = "Nova senha é obrigatória") @StrongPassword String newPassword
) {
}
