package com.financetracker.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.financetracker.api.Routes;
import com.financetracker.api.dto.auth.ForgotPasswordRequest;
import com.financetracker.api.dto.auth.ForgotPasswordResponse;
import com.financetracker.api.dto.auth.LoginRequest;
import com.financetracker.api.dto.auth.RegisterRequest;
import com.financetracker.api.dto.auth.ResetPasswordRequest;
import com.financetracker.api.dto.auth.TokenResponse;
import com.financetracker.api.dto.common.MessageResponse;
import com.financetracker.api.dto.user.UserResponse;
import com.financetracker.api.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping(Routes.Auth.BASE)
@Tag(name = "Autenticacao")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping(Routes.Auth.REGISTER)
    @Operation(summary = "Cria uma nova conta de usuario")
    ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping(Routes.Auth.LOGIN)
    @Operation(summary = "Autentica o usuario e retorna o JWT")
    TokenResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping(Routes.Auth.FORGOT_PASSWORD)
    @Operation(summary = "Solicita a recuperacao de senha")
    ForgotPasswordResponse forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return authService.forgotPassword(request);
    }

    @PostMapping(Routes.Auth.RESET_PASSWORD)
    @Operation(summary = "Redefine a senha com um token valido")
    MessageResponse resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return authService.resetPassword(request);
    }
}
