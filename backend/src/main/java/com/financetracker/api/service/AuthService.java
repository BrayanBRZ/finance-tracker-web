package com.financetracker.api.service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
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
import com.financetracker.api.util.EmailNormalizer;

@Service
public class AuthService {
    public static final String FORGOT_MESSAGE = "Se este e-mail estiver cadastrado, você receberá as instruções em breve.";
    private static final String INVALID_RESET = "O link de redefinição é inválido, expirou ou já foi utilizado.";

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final SendEmailService sendEmailService;
    private final long resetExpirationMs;
    private final boolean exposeResetToken;

    public AuthService(
            UserRepository userRepository,
            PasswordResetTokenRepository passwordResetTokenRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            SendEmailService sendEmailService,
            @Value("${app.password-reset.expiration}") long resetExpirationMs,
            @Value("${app.auth.expose-reset-token}") boolean exposeResetToken) {
        this.userRepository = userRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.sendEmailService = sendEmailService;
        this.resetExpirationMs = resetExpirationMs;
        this.exposeResetToken = exposeResetToken;
    }

    @Transactional
    public UserResponse register(RegisterRequest request) {
        String email = EmailNormalizer.normalize(request.email());

        if (userRepository.existsByEmail(email)) {
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "Este e-mail já está cadastrado");
        }

        User user = userRepository.save(
                new User(
                        request.name().trim(),
                        email,
                        passwordEncoder.encode(request.password())));

        sendEmailService.sendWelcomeEmail(user);

        return UserMapper.toResponse(user);
    }

    @Transactional(readOnly = true)
    public TokenResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(EmailNormalizer.normalize(request.email()))
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
        return userRepository.findByEmail(EmailNormalizer.normalize(request.email()))
                .map(user -> {
                    String rawToken = UUID.randomUUID().toString();

                    passwordResetTokenRepository.save(new PasswordResetToken(
                            user,
                            rawToken,
                            LocalDateTime.now().plus(resetExpirationMs, ChronoUnit.MILLIS)));

                    sendEmailService.sendPasswordResetEmail(user, rawToken);

                    return new ForgotPasswordResponse(
                            FORGOT_MESSAGE,
                            exposeResetToken ? rawToken : null);
                })
                .orElseGet(() -> new ForgotPasswordResponse(FORGOT_MESSAGE, null));
    }

    @Transactional
    public MessageResponse resetPassword(ResetPasswordRequest request) {
        PasswordResetToken token = passwordResetTokenRepository.findByToken(request.token())
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, INVALID_RESET));

        if (token.isUsed() || token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, INVALID_RESET);
        }

        token.getUser().setPasswordHash(passwordEncoder.encode(request.newPassword()));
        token.markUsed();

        return new MessageResponse("Senha redefinida com sucesso.");
    }

    private ApiException invalidCredentials() {
        return new ApiException(HttpStatus.UNAUTHORIZED, "E-mail ou senha incorretos");
    }
}
