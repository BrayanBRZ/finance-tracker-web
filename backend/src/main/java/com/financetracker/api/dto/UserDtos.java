package com.financetracker.api.dto;

import com.financetracker.api.validation.StrongPassword;
import jakarta.validation.constraints.*;

public final class UserDtos {
    private UserDtos() {}

    public record UpdateUserRequest(
        @NotBlank(message = "Nome é obrigatório") @Size(max = 120) String name,
        @NotBlank(message = "E-mail é obrigatório") @Email(message = "Formato de e-mail inválido") String email
    ) {}

    public record ChangePasswordRequest(
        @NotBlank(message = "Senha atual é obrigatória") String currentPassword,
        @NotBlank(message = "Nova senha é obrigatória") @StrongPassword String newPassword
    ) {}
}
