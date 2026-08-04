package com.financetracker.api.controller;

import static com.financetracker.api.dto.AuthDtos.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.financetracker.api.exception.*;
import com.financetracker.api.service.AuthService;
import java.time.Instant;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.*;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

class AuthControllerTest {
    AuthService authService;
    MockMvc mvc;
    ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        authService = mock(AuthService.class);
        objectMapper = new ObjectMapper().findAndRegisterModules();
        mvc = MockMvcBuilders
            .standaloneSetup(new AuthController(authService))
            .setControllerAdvice(new GlobalExceptionHandler())
            .build();
    }

    @Test
    void registerReturnsCreatedPublicUser() throws Exception {
        when(authService.register(any())).thenReturn(
            new UserResponse(1L, "User", "user@example.com", Instant.now(), Instant.now())
        );

        mvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"name":"User","email":"user@example.com","password":"Aa!12345"}
                    """))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.email").value("user@example.com"))
            .andExpect(jsonPath("$.passwordHash").doesNotExist());
    }

    @Test
    void registerReturnsFieldErrorsForWeakPassword() throws Exception {
        mvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"name":"User","email":"invalid","password":"123"}
                    """))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.timestamp").exists())
            .andExpect(jsonPath("$.status").value(400))
            .andExpect(jsonPath("$.error").value("Bad Request"))
            .andExpect(jsonPath("$.message").value("Dados inválidos"))
            .andExpect(jsonPath("$.fieldErrors.email").exists())
            .andExpect(jsonPath("$.fieldErrors.password").exists());
    }

    @Test
    void loginUsesStableErrorContract() throws Exception {
        when(authService.login(any())).thenThrow(
            new ApiException(HttpStatus.UNAUTHORIZED, "E-mail ou senha incorretos")
        );

        mvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"email":"user@example.com","password":"wrong"}
                    """))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.status").value(401))
            .andExpect(jsonPath("$.message").value("E-mail ou senha incorretos"));
    }

    @Test
    void forgotPasswordOmitsNullDebugToken() throws Exception {
        when(authService.forgotPassword(any())).thenReturn(
            new ForgotPasswordResponse(AuthService.FORGOT_MESSAGE, null)
        );

        mvc.perform(post("/api/v1/auth/forgot-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"missing@example.com\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value(AuthService.FORGOT_MESSAGE))
            .andExpect(jsonPath("$.debugToken").doesNotExist());
    }
}
