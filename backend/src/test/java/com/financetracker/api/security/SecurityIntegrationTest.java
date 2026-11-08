package com.financetracker.api.security;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.financetracker.api.config.SecurityConfig;
import com.financetracker.api.controller.AuthController;
import com.financetracker.api.controller.UserController;
import com.financetracker.api.entity.User;
import com.financetracker.api.repository.UserRepository;
import com.financetracker.api.service.AuthService;
import com.financetracker.api.service.UserService;

import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.Cookie;

@WebMvcTest(controllers = { AuthController.class, UserController.class })
@Import({ SecurityConfig.class, JwtAuthenticationFilter.class, AuthRateLimiter.class })
@TestPropertySource(properties = {
        "app.cors.allowed-origins=https://finance.example",
        "app.auth.rate-limit.max-requests=2"
})
class SecurityIntegrationTest {
    @Autowired private MockMvc mvc;
    @MockitoBean private AuthService authService;
    @MockitoBean private UserService userService;
    @MockitoBean private JwtService jwtService;
    @MockitoBean private UserRepository users;

    @Test
    void privateApiRejectsAnonymousAndCookieOnlyAuthenticationAndIncludesSecurityHeaders() throws Exception {
        mvc.perform(get("/api/v1/users/me").servletPath("/api/v1/users/me").secure(true))
                .andExpect(status().isUnauthorized())
                .andExpect(header().string("X-Content-Type-Options", "nosniff"))
                .andExpect(header().string("X-Frame-Options", "DENY"))
                .andExpect(header().string("Referrer-Policy", "no-referrer"))
                .andExpect(header().exists("Strict-Transport-Security"))
                .andExpect(header().string("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'; base-uri 'none'"));
        mvc.perform(get("/api/v1/users/me").cookie(new Cookie("accessToken", "cookie-token")))
                .andExpect(status().isUnauthorized());
        verifyNoInteractions(userService);
    }

    @Test
    void bearerAuthenticationUsesTheServerIdentityAndDoesNotRequireCsrfCookies() throws Exception {
        UUID uuid = UUID.randomUUID();
        User user = mock(User.class);
        var claims = Jwts.claims().subject(uuid.toString()).build();
        when(jwtService.parse("valid-token")).thenReturn(claims);
        when(jwtService.extractUserUuid(claims)).thenReturn(uuid);
        when(users.findByUuid(uuid)).thenReturn(Optional.of(user));
        when(jwtService.isValid(claims, user)).thenReturn(true);
        when(user.getId()).thenReturn(42L);
        mvc.perform(patch("/api/v1/users/me/password").servletPath("/api/v1/users/me/password")
                        .header("Authorization", "Bearer valid-token").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"currentPassword\":\"Current@123\",\"newPassword\":\"New@12345\",\"userId\":99}"))
                .andExpect(status().isOk());
        verify(userService).changePassword(org.mockito.ArgumentMatchers.eq(42L), any());
    }

    @Test
    void authLimitCannotBeBypassedWithForwardedHeadersAndPreventsServiceCalls() throws Exception {
        String path = "/api/v1/auth/login";
        for (int i = 0; i < 3; i++) {
            var result = mvc.perform(post(path).servletPath(path)
                    .with(request -> { request.setRemoteAddr("192.0.2.10"); return request; })
                    .header("X-Forwarded-For", "198.51.100." + i)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"email\":\"user@example.com\",\"password\":\"Password@123\"}"));
            if (i < 2) result.andExpect(status().isOk());
            else result.andExpect(status().isTooManyRequests())
                    .andExpect(header().exists("Retry-After"))
                    .andExpect(header().string("Cache-Control", "no-store"))
                    .andExpect(header().string("X-Content-Type-Options", "nosniff"))
                    .andExpect(jsonPath("$.status").value(429));
        }
        verify(authService, times(2)).login(any());
    }

    @Test
    void everySensitiveAuthOperationHasAnIndependentLimit() throws Exception {
        for (String operation : new String[] { "register", "forgot-password", "reset-password" }) {
            String path = "/api/v1/auth/" + operation;
            for (int i = 0; i < 3; i++) {
                mvc.perform(post(path).servletPath(path)
                                .with(request -> { request.setRemoteAddr("192.0.2.20"); return request; })
                                .contentType(MediaType.APPLICATION_JSON).content("{}"))
                        .andExpect(i < 2 ? status().isBadRequest() : status().isTooManyRequests());
            }
        }
        verifyNoInteractions(authService);
    }

    @Test
    void corsAllowsOnlyConfiguredOriginsAndDoesNotConsumeAuthAttempts() throws Exception {
        for (int i = 0; i < 3; i++) {
            mvc.perform(options("/api/v1/auth/login").header("Origin", "https://finance.example")
                            .header("Access-Control-Request-Method", "POST"))
                    .andExpect(status().isOk())
                    .andExpect(header().string("Access-Control-Allow-Origin", "https://finance.example"));
        }
        mvc.perform(post("/api/v1/auth/login").header("Origin", "https://untrusted.example"))
                .andExpect(status().isForbidden());
        verifyNoInteractions(authService);
    }

    @Test
    void passwordChangesAreRateLimitedEvenWithInvalidAuthentication() throws Exception {
        String path = "/api/v1/users/me/password";
        for (int i = 0; i < 3; i++) {
            mvc.perform(patch(path).servletPath(path)
                            .with(request -> { request.setRemoteAddr("192.0.2.30"); return request; }))
                    .andExpect(i < 2 ? status().isUnauthorized() : status().isTooManyRequests());
        }
        verifyNoInteractions(userService);
    }

    @Test
    void oversizedUtf8PasswordsAreRejectedBeforeBcryptOrPersistence() throws Exception {
        String path = "/api/v1/auth/register";
        mvc.perform(post(path).servletPath(path)
                        .with(request -> { request.setRemoteAddr("192.0.2.40"); return request; })
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"User\",\"email\":\"user@example.com\",\"password\":\"" + "é".repeat(37) + "\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.password").exists());
        verifyNoInteractions(authService);
    }

    @Test
    void malformedTokensAndUnlistedAuthPathsAreNotPublic() throws Exception {
        when(jwtService.parse("invalid")).thenThrow(new io.jsonwebtoken.MalformedJwtException("invalid"));
        mvc.perform(get("/api/v1/users/me").header("Authorization", "Bearer invalid"))
                .andExpect(status().isUnauthorized());
        mvc.perform(post("/api/v1/auth/unlisted"))
                .andExpect(status().isUnauthorized());
        verifyNoInteractions(authService, userService);
    }
}
