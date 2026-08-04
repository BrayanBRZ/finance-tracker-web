package com.financetracker.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.financetracker.api.validation.StrongPassword;
import jakarta.validation.constraints.*;
import java.time.Instant;

public final class AuthDtos {
    private AuthDtos() {}

    public record RegisterRequest(
        @NotBlank(message = "Nome é obrigatório") @Size(max = 120) String name,
        @NotBlank(message = "E-mail é obrigatório") @Email(message = "Formato de e-mail inválido") String email,
        @NotBlank(message = "Senha é obrigatória") @StrongPassword String password
    ) {}

    public record LoginRequest(
        @NotBlank(message = "E-mail é obrigatório") @Email(message = "Formato de e-mail inválido") String email,
        @NotBlank(message = "Senha é obrigatória") String password
    ) {}

    public record ForgotPasswordRequest(
        @NotBlank(message = "E-mail é obrigatório") @Email(message = "Formato de e-mail inválido") String email
    ) {}

    public record ResetPasswordRequest(
        @NotBlank(message = "Token é obrigatório") String token,
        @NotBlank(message = "Nova senha é obrigatória") @StrongPassword String newPassword
    ) {}

    public record TokenResponse(String accessToken, String tokenType, long expiresIn) {}
    public record MessageResponse(String message) {}
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record ForgotPasswordResponse(String message, String debugToken) {}
    public record UserResponse(Long id, String name, String email, Instant createdAt, Instant updatedAt) {}
}
