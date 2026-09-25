package com.financetracker.api.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.junit.jupiter.api.Test;

import com.financetracker.api.dto.summary.CategoryTotalResponse;
import com.financetracker.api.dto.summary.MonthlyTotalResponse;
import com.financetracker.api.dto.summary.WalletSummaryResponse;

class PdfSummaryRendererTest {
    private final PdfSummaryRenderer renderer = new PdfSummaryRenderer();

    @Test
    void rendersEmptyPeriodWithValidPdfAndPortugueseText() throws IOException {
        byte[] pdf = renderer.render(
                "Família São João",
                LocalDate.of(2026, 9, 1),
                LocalDate.of(2026, 9, 30),
                new WalletSummaryResponse(BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO,
                        0, List.of(), List.of(), List.of()));

        assertEquals("%PDF-", new String(pdf, 0, 5, java.nio.charset.StandardCharsets.US_ASCII));
        try (PDDocument document = Loader.loadPDF(pdf)) {
            String text = new PDFTextStripper().getText(document);
            assertEquals(1, document.getNumberOfPages());
            assertTrue(text.contains("Família São João"));
            assertTrue(text.contains("01/09/2026 a 30/09/2026"));
            assertTrue(text.contains("Sem movimentações no período."));
        }
    }

    @Test
    void paginatesLongCategoryTableWithoutDroppingLastRow() throws IOException {
        List<CategoryTotalResponse> categories = new ArrayList<>();
        for (int index = 1; index <= 90; index++) {
            categories.add(new CategoryTotalResponse(UUID.randomUUID(),
                    "Categoria de alimentação e compras número " + index,
                    new BigDecimal("12.50")));
        }
        WalletSummaryResponse summary = new WalletSummaryResponse(
                new BigDecimal("1000.00"), new BigDecimal("500.00"), new BigDecimal("500.00"),
                90, categories,
                List.of(new MonthlyTotalResponse("2026-09", new BigDecimal("1000.00"), new BigDecimal("500.00"))),
                List.of());

        byte[] pdf = renderer.render("Carteira de teste", LocalDate.of(2026, 9, 1),
                LocalDate.of(2026, 9, 30), summary);
        try (PDDocument document = Loader.loadPDF(pdf)) {
            String text = new PDFTextStripper().getText(document);
            assertTrue(document.getNumberOfPages() > 1);
            assertTrue(text.contains("Categoria de alimentação e compras número 90"));
            assertTrue(text.contains("Totais por mês"));
        }
    }
}
