package com.financetracker.api.dto.user;

import com.financetracker.api.validation.StrongPassword;
import com.financetracker.api.validation.PasswordByteLength;
import jakarta.validation.constraints.NotBlank;

public record ChangePasswordRequest(
    @NotBlank(message = "Senha atual é obrigatória") @PasswordByteLength String currentPassword,
    @NotBlank(message = "Nova senha é obrigatória") @StrongPassword String newPassword
) {
}
