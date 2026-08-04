package com.financetracker.api.service;

import static com.financetracker.api.dto.AuthDtos.*;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import com.financetracker.api.entity.*;
import com.financetracker.api.exception.ApiException;
import com.financetracker.api.repository.*;
import com.financetracker.api.security.JwtService;
import java.time.Instant;
import java.util.Optional;
import org.junit.jupiter.api.*;
import org.mockito.*;
import org.springframework.security.crypto.password.PasswordEncoder;

class AuthServiceTest {
    @Mock UserRepository users;
    @Mock PasswordResetTokenRepository tokens;
    @Mock PasswordEncoder encoder;
    @Mock JwtService jwt;
    AuthService service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        service = new AuthService(users, tokens, encoder, jwt, 3_600_000);
    }

    @Test
    void registersNormalizedUser() {
        when(users.existsByEmail("user@example.com")).thenReturn(false);
        when(encoder.encode("Aa!12345")).thenReturn("hash");
        when(users.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserResponse result = service.register(
            new RegisterRequest("  Brayan  ", " USER@Example.com ", "Aa!12345")
        );

        assertThat(result.name()).isEqualTo("Brayan");
        assertThat(result.email()).isEqualTo("user@example.com");
    }

    @Test
    void rejectsDuplicateEmail() {
        when(users.existsByEmail("user@example.com")).thenReturn(true);

        assertThatThrownBy(() -> service.register(
            new RegisterRequest("User", "user@example.com", "Aa!12345")
        )).isInstanceOf(ApiException.class).hasMessage("Este e-mail já está cadastrado");
    }

    @Test
    void logsInAndReturnsJwt() {
        User user = new User("User", "user@example.com", "hash");
        when(users.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(encoder.matches("Aa!12345", "hash")).thenReturn(true);
        when(jwt.generate(user)).thenReturn("jwt");
        when(jwt.getExpirationSeconds()).thenReturn(86_400L);

        assertThat(service.login(new LoginRequest("user@example.com", "Aa!12345")).accessToken())
            .isEqualTo("jwt");
    }

    @Test
    void rejectsInvalidPassword() {
        User user = new User("User", "user@example.com", "hash");
        when(users.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(encoder.matches(anyString(), anyString())).thenReturn(false);

        assertThatThrownBy(() -> service.login(new LoginRequest("user@example.com", "wrong")))
            .isInstanceOf(ApiException.class).hasMessage("E-mail ou senha incorretos");
    }

    @Test
    void forgotPasswordIsNeutralForMissingEmail() {
        when(users.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        ForgotPasswordResponse response =
            service.forgotPassword(new ForgotPasswordRequest("missing@example.com"));

        assertThat(response.message()).isEqualTo(AuthService.FORGOT_MESSAGE);
        assertThat(response.debugToken()).isNull();
        verify(tokens, never()).save(any());
    }

    @Test
    void forgotPasswordCreatesDebugTokenForExistingEmail() {
        User user = new User("User", "user@example.com", "hash");
        when(users.findByEmail("user@example.com")).thenReturn(Optional.of(user));

        ForgotPasswordResponse response =
            service.forgotPassword(new ForgotPasswordRequest("user@example.com"));

        assertThat(response.debugToken()).isNotBlank();
        verify(tokens).save(any(PasswordResetToken.class));
    }

    @Test
    void rejectsMissingResetToken() {
        when(tokens.findByToken("missing")).thenReturn(Optional.empty());
        assertInvalidReset("missing");
    }

    @Test
    void rejectsExpiredResetToken() {
        PasswordResetToken token = new PasswordResetToken(
            new User("User", "user@example.com", "hash"),
            "expired",
            Instant.now().minusSeconds(1)
        );
        when(tokens.findByToken("expired")).thenReturn(Optional.of(token));
        assertInvalidReset("expired");
    }

    @Test
    void rejectsUsedResetToken() {
        PasswordResetToken token = new PasswordResetToken(
            new User("User", "user@example.com", "hash"),
            "used",
            Instant.now().plusSeconds(60)
        );
        token.markUsed();
        when(tokens.findByToken("used")).thenReturn(Optional.of(token));
        assertInvalidReset("used");
    }

    @Test
    void resetsPasswordAndConsumesToken() {
        User user = new User("User", "user@example.com", "old");
        PasswordResetToken token =
            new PasswordResetToken(user, "valid", Instant.now().plusSeconds(60));
        when(tokens.findByToken("valid")).thenReturn(Optional.of(token));
        when(encoder.encode("New!1234")).thenReturn("new");

        MessageResponse response =
            service.resetPassword(new ResetPasswordRequest("valid", "New!1234"));

        assertThat(response.message()).isEqualTo("Senha redefinida com sucesso.");
        assertThat(user.getPasswordHash()).isEqualTo("new");
        assertThat(token.getUsedAt()).isNotNull();
    }

    private void assertInvalidReset(String value) {
        assertThatThrownBy(() ->
            service.resetPassword(new ResetPasswordRequest(value, "New!1234")))
            .isInstanceOf(ApiException.class)
            .hasMessage("O link de redefinição é inválido, expirou ou já foi utilizado.");
    }
}
