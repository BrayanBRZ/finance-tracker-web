package com.financetracker.api.dto.auth;

import com.financetracker.api.validation.StrongPassword;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequest(
    @NotBlank(message = "Token é obrigatório") @Size(max = 36) String token,
    @NotBlank(message = "Nova senha é obrigatória") @StrongPassword String newPassword
) {
}
