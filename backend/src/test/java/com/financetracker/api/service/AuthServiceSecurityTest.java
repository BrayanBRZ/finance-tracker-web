package com.financetracker.api.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.mock.env.MockEnvironment;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.financetracker.api.dto.auth.ForgotPasswordRequest;
import com.financetracker.api.entity.User;
import com.financetracker.api.repository.PasswordResetTokenRepository;
import com.financetracker.api.repository.UserRepository;
import com.financetracker.api.security.JwtService;

class AuthServiceSecurityTest {
    private final UserRepository users = mock(UserRepository.class);
    private final PasswordResetTokenRepository tokens = mock(PasswordResetTokenRepository.class);
    private final SendEmailService mail = mock(SendEmailService.class);

    private AuthService service(boolean exposeToken, String profile) {
        return new AuthService(users, tokens, mock(PasswordEncoder.class), mock(JwtService.class), mail,
                3600000, exposeToken, new MockEnvironment().withProperty("spring.profiles.active", profile));
    }

    @Test
    void passwordRecoveryDoesNotRevealTokensOrAccountExistenceInTheResponse() throws Exception {
        User user = new User("User", "user@example.com", "unused");
        when(users.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(users.findByEmail("absent@example.com")).thenReturn(Optional.empty());
        var service = service(false, "prod");
        var existing = service.forgotPassword(new ForgotPasswordRequest("user@example.com"));
        var absent = service.forgotPassword(new ForgotPasswordRequest("absent@example.com"));
        ObjectMapper mapper = new ObjectMapper();
        assertEquals(mapper.writeValueAsString(absent), mapper.writeValueAsString(existing));
        assertFalse(mapper.writeValueAsString(existing).contains("debugToken"));
        verify(tokens).save(any());
        verify(mail).sendPasswordResetEmail(org.mockito.ArgumentMatchers.eq(user), any());
    }

    @Test
    void tokenDebuggingRequiresTheExplicitLocalProfile() {
        assertThrows(IllegalArgumentException.class, () -> service(true, "prod"));
        when(users.findByEmail("user@example.com"))
                .thenReturn(Optional.of(new User("User", "user@example.com", "unused")));
        assertNotNull(service(true, "local").forgotPassword(new ForgotPasswordRequest("user@example.com")).debugToken());
    }
}
