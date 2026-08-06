package com.financetracker.api.controller;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.financetracker.api.Routes;
import com.financetracker.api.dto.summary.WalletSummaryResponse;
import com.financetracker.api.security.AuthenticatedUser;
import com.financetracker.api.service.WalletSummaryService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping(Routes.Wallets.SUMMARY)
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Resumo financeiro")
public class WalletSummaryController {
    private final WalletSummaryService walletSummaryService;

    public WalletSummaryController(WalletSummaryService walletSummaryService) {
        this.walletSummaryService = walletSummaryService;
    }

    @GetMapping
    @Operation(summary = "Retorna o resumo financeiro da carteira")
    WalletSummaryResponse get(
            @AuthenticationPrincipal AuthenticatedUser user,
            @PathVariable("walletId") Long walletId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return walletSummaryService.get(user.id(), walletId, startDate, endDate);
    }
}
