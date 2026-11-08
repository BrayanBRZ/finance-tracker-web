package com.financetracker.api.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.method.annotation.AuthenticationPrincipalArgumentResolver;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import com.financetracker.api.dto.insight.*;
import com.financetracker.api.exception.GlobalExceptionHandler;
import com.financetracker.api.security.AuthenticatedUser;
import com.financetracker.api.service.WalletInsightService;

class WalletInsightControllerTest {
    private final WalletInsightService service = mock(WalletInsightService.class);
    private final UUID wallet = UUID.randomUUID();
    private final String path = "/api/v1/wallets/" + wallet + "/insights";
    private MockMvc mvc;

    @BeforeEach
    void setup() {
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
                new AuthenticatedUser(42L), null, List.of()));
        mvc = MockMvcBuilders.standaloneSetup(new WalletInsightController(service))
                .setCustomArgumentResolvers(new AuthenticationPrincipalArgumentResolver())
                .setControllerAdvice(new GlobalExceptionHandler()).build();
    }

    @AfterEach
    void clearSecurity() { SecurityContextHolder.clearContext(); }

    @Test
    void usesAuthenticatedUserAndReturnsStructuredPrivateResponse() throws Exception {
        var request = new InsightRequest(LocalDate.of(2026, 11, 1), LocalDate.of(2026, 11, 30));
        var response = new InsightResponse(request.startDate(), request.endDate(), Instant.now(), false, false,
                new InsightContent("Resumo", List.of("Observação"), List.of("Sugestão")));
        when(service.generate(42L, wallet, request)).thenReturn(response);
        mvc.perform(post(path).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"startDate\":\"2026-11-01\",\"endDate\":\"2026-11-30\",\"userId\":99}"))
                .andExpect(status().isOk()).andExpect(header().string("Cache-Control", "no-store"))
                .andExpect(jsonPath("$.analysis.summary").value("Resumo"));
        verify(service).generate(42L, wallet, request);
    }

    @Test
    void invalidBodiesNeverInvokeGeneration() throws Exception {
        for (String body : List.of("{}", "{\"startDate\":\"invalid\",\"endDate\":\"2026-11-30\"}", "null")) {
            mvc.perform(post(path).contentType(MediaType.APPLICATION_JSON).content(body)).andExpect(status().isBadRequest());
        }
        verifyNoInteractions(service);
    }
}
