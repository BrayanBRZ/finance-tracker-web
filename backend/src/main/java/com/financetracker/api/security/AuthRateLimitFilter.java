package com.financetracker.api.security;

import java.io.IOException;
import java.time.Instant;
import java.util.Set;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.financetracker.api.Routes;
import com.financetracker.api.exception.ApiError;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class AuthRateLimitFilter extends OncePerRequestFilter {
    private static final Set<String> AUTH_OPERATIONS = Set.of(
            Routes.Auth.BASE + Routes.Auth.LOGIN,
            Routes.Auth.BASE + Routes.Auth.REGISTER,
            Routes.Auth.BASE + Routes.Auth.FORGOT_PASSWORD,
            Routes.Auth.BASE + Routes.Auth.RESET_PASSWORD);
    private final AuthRateLimiter limiter;
    private final ObjectMapper mapper;

    public AuthRateLimitFilter(AuthRateLimiter limiter, ObjectMapper mapper) {
        this.limiter = limiter;
        this.mapper = mapper;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        return !("POST".equals(request.getMethod()) && AUTH_OPERATIONS.contains(path))
                && !("PATCH".equals(request.getMethod()) && "/api/v1/users/me/password".equals(path));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        // Never trust a caller-supplied X-Forwarded-For. Trusted proxy handling belongs at the server/edge.
        long retryAfter = limiter.retryAfter(request.getRemoteAddr(), request.getServletPath());
        if (retryAfter == 0) {
            chain.doFilter(request, response);
            return;
        }
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.setHeader(HttpHeaders.RETRY_AFTER, Long.toString(retryAfter));
        response.setHeader(HttpHeaders.CACHE_CONTROL, "no-store");
        mapper.writeValue(response.getOutputStream(), new ApiError(Instant.now(), 429, "Too Many Requests",
                "Muitas tentativas. Aguarde e tente novamente.", null));
    }
}
