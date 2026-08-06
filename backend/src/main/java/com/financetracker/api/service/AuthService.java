package com.financetracker.api.service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Locale;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.financetracker.api.dto.auth.ForgotPasswordRequest;
import com.financetracker.api.dto.auth.ForgotPasswordResponse;
import com.financetracker.api.dto.auth.LoginRequest;
import com.financetracker.api.dto.auth.RegisterRequest;
import com.financetracker.api.dto.auth.ResetPasswordRequest;
import com.financetracker.api.dto.auth.TokenResponse;
import com.financetracker.api.dto.common.MessageResponse;
import com.financetracker.api.dto.user.UserResponse;
import com.financetracker.api.entity.PasswordResetToken;
import com.financetracker.api.entity.User;
import com.financetracker.api.exception.ApiException;
import com.financetracker.api.mapper.UserMapper;
import com.financetracker.api.repository.PasswordResetTokenRepository;
import com.financetracker.api.repository.UserRepository;
import com.financetracker.api.security.JwtService;

@Service
public class AuthService {
    public static final String FORGOT_MESSAGE = "Se este e-mail estiver cadastrado, você receberá as instruções em breve.";
    private static final String INVALID_RESET = "O link de redefinição é inválido, expirou ou já foi utilizado.";

    private final UserRepository users;

    private final PasswordResetTokenRepository resetTokens;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    private final long resetExpirationMs;

    public AuthService(
            UserRepository users,
            PasswordResetTokenRepository resetTokens,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            @Value("${app.password-reset.expiration}") long resetExpirationMs) {
        this.users = users;
        this.resetTokens = resetTokens;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.resetExpirationMs = resetExpirationMs;
    }

    @Transactional
    public UserResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.email());

        if (users.existsByEmail(email)) {
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "Este e-mail já está cadastrado");
        }

        User user = users.save(
                new User(
                        request.name().trim(),
                        email,
                        passwordEncoder.encode(request.password())));

        return UserMapper.toResponse(user);
    }

    @Transactional(readOnly = true)
    public TokenResponse login(LoginRequest request) {
        User user = users.findByEmail(normalizeEmail(request.email()))
                .orElseThrow(this::invalidCredentials);

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw invalidCredentials();
        }

        return new TokenResponse(
                jwtService.generate(user),
                "Bearer",
                jwtService.getExpirationSeconds());
    }

    @Transactional
    public ForgotPasswordResponse forgotPassword(ForgotPasswordRequest request) {
        return users.findByEmail(normalizeEmail(request.email()))
                .map(user -> {
                    String token = UUID.randomUUID().toString();

                    resetTokens.save(new PasswordResetToken(
                            user,
                            token,
                            LocalDateTime.now().plus(resetExpirationMs, ChronoUnit.MILLIS)));

                    return new ForgotPasswordResponse(FORGOT_MESSAGE, token);
                })
                .orElseGet(() -> new ForgotPasswordResponse(FORGOT_MESSAGE, null));
    }

    @Transactional
    public MessageResponse resetPassword(ResetPasswordRequest request) {
        PasswordResetToken token = resetTokens.findByToken(request.token())
                .orElseThrow(() -> new ApiException(HttpStatus.UNPROCESSABLE_ENTITY, INVALID_RESET));

        if (token.getIsUsed() || token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ApiException(HttpStatus.UNPROCESSABLE_ENTITY, INVALID_RESET);
        }

        token.getUser().setPasswordHash(passwordEncoder.encode(request.newPassword()));
        token.markUsed();

        return new MessageResponse("Senha redefinida com sucesso.");
    }

    private ApiException invalidCredentials() {
        return new ApiException(HttpStatus.UNAUTHORIZED, "E-mail ou senha incorretos");
    }

    static String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
