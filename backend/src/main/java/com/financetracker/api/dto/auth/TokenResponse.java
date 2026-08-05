package com.financetracker.api.dto.auth;

public record TokenResponse(String accessToken, String tokenType, long expiresIn) {
}
