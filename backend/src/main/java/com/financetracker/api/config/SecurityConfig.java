package com.financetracker.api.config;

import java.io.IOException;
import java.time.Instant;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter.ReferrerPolicy;
import org.springframework.security.web.header.writers.DelegatingRequestMatcherHeaderWriter;
import org.springframework.security.web.header.writers.StaticHeadersWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.financetracker.api.exception.ApiError;
import com.financetracker.api.security.JwtAuthenticationFilter;
import com.financetracker.api.security.AuthRateLimitFilter;
import com.financetracker.api.security.AuthRateLimiter;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
public class SecurityConfig {
        @Bean
        PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        CorsConfigurationSource corsConfigurationSource(@Value("${app.cors.allowed-origins}") List<String> origins) {
                CorsConfiguration config = new CorsConfiguration();

                config.setAllowedOrigins(origins);
                config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
                config.setAllowedHeaders(List.of(HttpHeaders.AUTHORIZATION, HttpHeaders.CONTENT_TYPE));
                config.setExposedHeaders(List.of(HttpHeaders.AUTHORIZATION, HttpHeaders.RETRY_AFTER));

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

                source.registerCorsConfiguration("/**", config);
                return source;
        }

        @Bean
        SecurityFilterChain securityFilterChain(
                        HttpSecurity http,
                        JwtAuthenticationFilter jwtFilter,
                        AuthRateLimiter rateLimiter,
                        ObjectMapper objectMapper) throws Exception {
                return http
                                // Bearer tokens are sent explicitly in headers; no cookie-based authentication.
                                .csrf(csrf -> csrf.disable())
                                .cors(Customizer.withDefaults())
                                .headers(headers -> headers
                                                .referrerPolicy(policy -> policy.policy(ReferrerPolicy.NO_REFERRER))
                                                .permissionsPolicyHeader(policy -> policy
                                                                .policy("camera=(), microphone=(), geolocation=()"))
                                                // Swagger serves its own HTML/scripts; restrict this policy to API
                                                // responses.
                                                .addHeaderWriter(new DelegatingRequestMatcherHeaderWriter(
                                                                request -> request.getServletPath().startsWith("/api/"),
                                                                new StaticHeadersWriter("Content-Security-Policy",
                                                                                "default-src 'none'; frame-ancestors 'none'; base-uri 'none'"))))
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authorizeHttpRequests(auth -> auth.requestMatchers(HttpMethod.POST,
                                                "/api/v1/auth/login", "/api/v1/auth/register",
                                                "/api/v1/auth/forgot-password", "/api/v1/auth/reset-password")
                                                .permitAll()
                                                .requestMatchers(HttpMethod.GET,
                                                                "/actuator/health",
                                                                "/swagger-ui.html",
                                                                "/swagger-ui/**",
                                                                "/v3/api-docs/**")
                                                .permitAll()
                                                .anyRequest().authenticated())
                                .exceptionHandling(errors -> errors
                                                .authenticationEntryPoint((request, response, exception) -> writeError(
                                                                response, objectMapper, HttpStatus.UNAUTHORIZED,
                                                                "Autenticação necessária"))
                                                .accessDeniedHandler((request, response, exception) -> writeError(
                                                                response, objectMapper, HttpStatus.FORBIDDEN,
                                                                "Acesso negado")))
                                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                                .addFilterBefore(new AuthRateLimitFilter(rateLimiter, objectMapper),
                                                JwtAuthenticationFilter.class)
                                .build();
        }

        private void writeError(
                        HttpServletResponse response,
                        ObjectMapper objectMapper,
                        HttpStatus status,
                        String message) throws IOException {
                response.setStatus(status.value());
                response.setContentType("application/json");
                objectMapper.writeValue(
                                response.getOutputStream(),
                                new ApiError(Instant.now(), status.value(), status.getReasonPhrase(), message, null));
        }
}
