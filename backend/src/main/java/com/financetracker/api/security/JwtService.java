package com.financetracker.api.security;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;
import java.util.Locale;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.financetracker.api.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
    private final SecretKey key;
    private final long expirationMs;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration}") long expirationMs) {
        if (secret == null || secret.isBlank() || secret.getBytes(StandardCharsets.UTF_8).length < 32
                || secret.strip().toLowerCase(Locale.ROOT).startsWith("substitua")
                || secret.strip().toLowerCase(Locale.ROOT).startsWith("change-me")) {
            throw new IllegalArgumentException("Configure JWT_SECRET com uma chave aleatória de pelo menos 256 bits, sem usar exemplos");
        }
        if (expirationMs < 1000) {
            throw new IllegalArgumentException("JWT_EXPIRATION deve ser de pelo menos 1000 milissegundos");
        }
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    public String generate(User user) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(user.getUuid().toString())
                .claim("email", user.getEmail())
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusMillis(expirationMs)))
                .signWith(key)
                .compact();
    }

    public Claims parse(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
    }

    public UUID extractUserUuid(Claims claims) {
        return UUID.fromString(claims.getSubject());
    }

    public boolean isValid(Claims claims, User user) {
        return user.getUuid().toString().equals(claims.getSubject())
                && user.getEmail().equals(claims.get("email", String.class))
                && claims.getExpiration() != null
                && claims.getExpiration().after(new Date());
    }

    public long getExpirationSeconds() {
        return expirationMs / 1000;
    }
}
