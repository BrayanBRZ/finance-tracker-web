package com.financetracker.api.dto.user;

import com.financetracker.api.validation.StrongPassword;
import jakarta.validation.constraints.NotBlank;

public record ChangePasswordRequest(
    @NotBlank(message = "Senha atual é obrigatória") String currentPassword,
    @NotBlank(message = "Nova senha é obrigatória") @StrongPassword String newPassword
) {
}
