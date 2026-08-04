package com.financetracker.api.security;

import static org.assertj.core.api.Assertions.*;

import com.financetracker.api.entity.User;
import java.lang.reflect.Field;
import org.junit.jupiter.api.Test;

class JwtServiceTest {
    private final JwtService jwt = new JwtService(
        "test-secret-with-more-than-thirty-two-bytes", 86_400_000
    );

    @Test
    void createsExpectedClaimsAndValidatesUser() throws Exception {
        User user = new User("User", "user@example.com", "hash");
        Field id = User.class.getDeclaredField("id");
        id.setAccessible(true);
        id.set(user, 42L);

        String token = jwt.generate(user);

        assertThat(jwt.extractUserId(token)).isEqualTo(42L);
        assertThat(jwt.parse(token).get("email", String.class)).isEqualTo("user@example.com");
        assertThat(jwt.isValid(token, user)).isTrue();
    }

    @Test
    void rejectsShortSecret() {
        assertThatThrownBy(() -> new JwtService("short", 1000))
            .isInstanceOf(IllegalArgumentException.class);
    }
}
