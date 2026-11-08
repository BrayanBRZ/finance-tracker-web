package com.financetracker.api.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.*;
import static org.springframework.test.web.client.response.MockRestResponseCreators.*;
import java.math.BigDecimal;
import java.net.SocketTimeoutException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.financetracker.api.config.InsightConfig.Settings;
import com.financetracker.api.dto.insight.InsightContext;
import com.financetracker.api.exception.ApiException;
import jakarta.validation.Validation;

class GeminiInsightProviderTest {
    private final ObjectMapper mapper = new ObjectMapper().findAndRegisterModules();
    private MockRestServiceServer server;
    private GeminiInsightProvider provider;
    private final InsightContext context = new InsightContext(LocalDate.of(2026, 11, 1), LocalDate.of(2026, 11, 30),
            "BRL", BigDecimal.TEN, BigDecimal.ONE, BigDecimal.valueOf(9), 2, List.of(), List.of());

    @BeforeEach
    void setup() {
        RestClient.Builder builder = RestClient.builder().baseUrl("https://generativelanguage.googleapis.com/v1beta");
        server = MockRestServiceServer.bindTo(builder).build();
        provider = new GeminiInsightProvider(builder.build(), new Settings(true, "test-key", "test-model", 20, 3, 10),
                mapper, Validation.buildDefaultValidatorFactory().getValidator());
    }

    @Test
    void sendsStructuredRequestAndParsesOnlyFinalResponse() throws Exception {
        server.expect(requestTo("https://generativelanguage.googleapis.com/v1beta/models/test-model:generateContent"))
                .andExpect(method(HttpMethod.POST)).andExpect(header("x-goog-api-key", "test-key"))
                .andExpect(jsonPath("$.generationConfig.responseMimeType").value("application/json"))
                .andExpect(jsonPath("$.generationConfig.responseJsonSchema.required[0]").value("summary"))
                .andExpect(request -> {
                    var body = mapper.readTree(((org.springframework.mock.http.client.MockClientHttpRequest) request)
                            .getBodyAsString());
                    var sentContext = mapper.readTree(body.path("contents").path(0).path("parts").path(0).path("text").asText());
                    assertEquals(2, sentContext.path("transactionCount").asInt());
                    assertFalse(sentContext.has("walletId"));
                    assertFalse(sentContext.has("transactions"));
                })
                .andRespond(withSuccess(envelope("{\"summary\":\"Resumo\",\"observations\":[\"Observação\"],\"suggestions\":[\"Sugestão\"]}"), MediaType.APPLICATION_JSON));
        assertEquals("Resumo", provider.generate(context).summary());
        server.verify();
    }

    @Test
    void rejectsMalformedOrOversizedOutputAndIncompleteCandidates() throws Exception {
        for (String output : List.of("not json", "null", "{\"summary\":\"\",\"observations\":[],\"suggestions\":[]}",
                mapper.writeValueAsString(Map.of("summary", "x".repeat(1201), "observations", List.of("a"), "suggestions", List.of("b"))))) {
            setup();
            server.expect(anything()).andRespond(withSuccess(envelope(output), MediaType.APPLICATION_JSON));
            assertEquals(HttpStatus.BAD_GATEWAY, assertThrows(ApiException.class, () -> provider.generate(context)).getStatus());
            server.verify();
        }
        setup();
        server.expect(anything()).andRespond(withSuccess("{\"candidates\":[{\"finishReason\":\"MAX_TOKENS\"}]}", MediaType.APPLICATION_JSON));
        assertEquals(HttpStatus.BAD_GATEWAY, assertThrows(ApiException.class, () -> provider.generate(context)).getStatus());
    }

    @Test
    void hidesProviderDetailsAndMapsQuotaAndTimeoutFailures() {
        server.expect(anything()).andRespond(withStatus(HttpStatus.TOO_MANY_REQUESTS).body("test-key private-provider-error"));
        var error = assertThrows(ApiException.class, () -> provider.generate(context));
        assertEquals(HttpStatus.SERVICE_UNAVAILABLE, error.getStatus());
        assertFalse(error.getMessage().contains("test-key"));
        setup();
        server.expect(anything()).andRespond(withException(new SocketTimeoutException("timeout")));
        assertEquals(HttpStatus.GATEWAY_TIMEOUT, assertThrows(ApiException.class, () -> provider.generate(context)).getStatus());
    }

    private String envelope(String text) throws Exception {
        return mapper.writeValueAsString(Map.of("candidates", List.of(Map.of("finishReason", "STOP", "content",
                Map.of("parts", List.of(Map.of("thought", true, "text", "Internal"), Map.of("text", text)))))));
    }
}
