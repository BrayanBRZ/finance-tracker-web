package com.financetracker.api.controller;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.financetracker.api.exception.GlobalExceptionHandler;
import com.financetracker.api.security.AuthenticatedUser;
import com.financetracker.api.service.WalletReportService;

class WalletReportControllerTest {
    private final WalletReportService reportService = mock(WalletReportService.class);
    private final WalletReportController controller = new WalletReportController(reportService);

    @Test
    void downloadSetsPdfAndPrivateDownloadHeaders() throws Exception {
        UUID walletId = UUID.randomUUID();
        LocalDate start = LocalDate.of(2026, 9, 1);
        LocalDate end = LocalDate.of(2026, 9, 30);
        byte[] pdf = "%PDF-1.7".getBytes(java.nio.charset.StandardCharsets.US_ASCII);
        when(reportService.generate(42L, walletId, start, end)).thenReturn(pdf);

        ResponseEntity<byte[]> response = controller.download(new AuthenticatedUser(42L), walletId, start, end);

        assertEquals(MediaType.APPLICATION_PDF, response.getHeaders().getContentType());
        assertTrue(response.getHeaders().getFirst(HttpHeaders.CONTENT_DISPOSITION).contains("attachment"));
        assertTrue(response.getHeaders().getCacheControl().contains("no-store"));
        assertArrayEquals(pdf, response.getBody());
    }

    @Test
    void missingAndMalformedDatesReturnBadRequest() throws Exception {
        MockMvc mvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        String path = "/api/v1/wallets/" + UUID.randomUUID() + "/reports/summary.pdf";

        mvc.perform(get(path).param("startDate", "2026-09-01"))
                .andExpect(status().isBadRequest());
        mvc.perform(get(path).param("startDate", "invalid").param("endDate", "2026-09-30"))
                .andExpect(status().isBadRequest());
    }
}
