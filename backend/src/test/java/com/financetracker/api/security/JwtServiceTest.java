package com.financetracker.api.security;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.UUID;

import org.junit.jupiter.api.Test;

import com.financetracker.api.entity.User;

import io.jsonwebtoken.JwtException;

class JwtServiceTest {
    @Test
    void rejectsMissingShortAndExampleSecrets() {
        for (String secret : new String[] { "", "short", "substitua-por-uma-chave-com-pelo-menos-32-caracteres" }) {
            assertThrows(IllegalArgumentException.class, () -> new JwtService(secret, 60000));
        }
    }

    @Test
    void acceptsOnlyTokensSignedWithTheConfiguredKeyAndMatchingUser() {
        User user = mock(User.class);
        UUID uuid = UUID.randomUUID();
        when(user.getUuid()).thenReturn(uuid);
        when(user.getEmail()).thenReturn("user@example.com");
        String secret = UUID.randomUUID().toString() + UUID.randomUUID();
        var service = new JwtService(secret, 60000);
        String token = service.generate(user);
        var claims = service.parse(token);
        assertTrue(service.isValid(claims, user));
        assertEquals(uuid, service.extractUserUuid(claims));
        var otherService = new JwtService(UUID.randomUUID().toString() + UUID.randomUUID(), 60000);
        assertThrows(JwtException.class, () -> otherService.parse(token));
        when(user.getEmail()).thenReturn("changed@example.com");
        assertFalse(service.isValid(claims, user));
    }
}
