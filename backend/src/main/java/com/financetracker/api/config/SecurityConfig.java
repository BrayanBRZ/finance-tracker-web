package com.financetracker.api.config;

import java.time.Instant;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.financetracker.api.exception.ApiError;
import com.financetracker.api.security.JwtAuthenticationFilter;

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
                config.setExposedHeaders(List.of(HttpHeaders.AUTHORIZATION));

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

                source.registerCorsConfiguration("/**", config);
                return source;
        }

        @Bean
        SecurityFilterChain securityFilterChain(
                        HttpSecurity http,
                        JwtAuthenticationFilter jwtFilter,
                        ObjectMapper objectMapper) throws Exception {
                return http
                                .csrf(csrf -> csrf.disable())
                                .cors(cors -> {
                                })
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authorizeHttpRequests(auth -> auth.requestMatchers(
                                                "/api/v1/auth/**",
                                                "/actuator/health",
                                                "/swagger-ui.html",
                                                "/swagger-ui/**",
                                                "/v3/api-docs/**")
                                                .permitAll()
                                                .anyRequest().authenticated())
                                .exceptionHandling(errors -> errors
                                                .authenticationEntryPoint((request, response, exception) -> {
                                                        HttpStatus status = HttpStatus.UNAUTHORIZED;
                                                        response.setStatus(status.value());
                                                        response.setContentType("application/json");
                                                        objectMapper.writeValue(response.getOutputStream(),
                                                                        new ApiError(Instant.now(), status.value(),
                                                                                        status.getReasonPhrase(),
                                                                                        "Autenticação necessária",
                                                                                        null));
                                                }).accessDeniedHandler((request, response, exception) -> {
                                                        HttpStatus status = HttpStatus.FORBIDDEN;
                                                        response.setStatus(status.value());
                                                        response.setContentType("application/json");
                                                        objectMapper.writeValue(response.getOutputStream(),
                                                                        new ApiError(Instant.now(), status.value(),
                                                                                        status.getReasonPhrase(),
                                                                                        "Acesso negado", null));
                                                }))
                                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                                .build();
        }
}
