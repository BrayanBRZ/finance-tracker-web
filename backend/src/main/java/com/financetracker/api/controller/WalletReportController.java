package com.financetracker.api.controller;

import java.io.IOException;
import java.time.LocalDate;
import java.util.UUID;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.CacheControl;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.financetracker.api.Routes;
import com.financetracker.api.security.AuthenticatedUser;
import com.financetracker.api.service.WalletReportService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping(Routes.Wallets.SUMMARY_REPORT)
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Relatórios")
public class WalletReportController {
    private final WalletReportService reportService;

    public WalletReportController(WalletReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping(produces = MediaType.APPLICATION_PDF_VALUE)
    @Operation(summary = "Baixa o resumo financeiro em PDF para um intervalo de datas")
    @ApiResponse(responseCode = "200", description = "Relatório PDF",
            content = @Content(mediaType = MediaType.APPLICATION_PDF_VALUE,
                    schema = @Schema(type = "string", format = "binary")))
    public ResponseEntity<byte[]> download(
            @AuthenticationPrincipal AuthenticatedUser user,
            @PathVariable("walletId") UUID walletId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) throws IOException {
        byte[] pdf = reportService.generate(user.id(), walletId, startDate, endDate);
        String filename = "relatorio-financeiro-" + startDate + "-a-" + endDate + ".pdf";
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .cacheControl(CacheControl.noStore())
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename(filename).build().toString())
                .contentLength(pdf.length)
                .body(pdf);
    }
}
