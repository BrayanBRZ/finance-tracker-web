package com.financetracker.api.service;

import static com.financetracker.api.dto.UserDtos.*;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.financetracker.api.entity.User;
import com.financetracker.api.exception.ApiException;
import com.financetracker.api.repository.UserRepository;
import java.util.Optional;
import org.junit.jupiter.api.*;
import org.mockito.*;
import org.springframework.security.crypto.password.PasswordEncoder;

class UserServiceTest {
    @Mock UserRepository users;
    @Mock PasswordEncoder encoder;
    UserService service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        service = new UserService(users, encoder);
    }

    @Test
    void changesPasswordWhenCurrentPasswordMatches() {
        User user = new User("User", "user@example.com", "old");
        when(users.findById(1L)).thenReturn(Optional.of(user));
        when(encoder.matches("Current!1", "old")).thenReturn(true);
        when(encoder.encode("New!1234")).thenReturn("new");

        var response = service.changePassword(
            1L, new ChangePasswordRequest("Current!1", "New!1234")
        );

        assertThat(response.message()).isEqualTo("Senha alterada com sucesso.");
        assertThat(user.getPasswordHash()).isEqualTo("new");
    }

    @Test
    void exposesCurrentPasswordAsFieldError() {
        User user = new User("User", "user@example.com", "old");
        when(users.findById(1L)).thenReturn(Optional.of(user));
        when(encoder.matches("wrong", "old")).thenReturn(false);

        assertThatThrownBy(() -> service.changePassword(
            1L, new ChangePasswordRequest("wrong", "New!1234")
        )).isInstanceOfSatisfying(ApiException.class, error ->
            assertThat(error.getFieldErrors()).containsKey("currentPassword"));
    }
}
