package com.financetracker.api.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.financetracker.api.Routes;
import com.financetracker.api.dto.transaction.PageResponse;
import com.financetracker.api.dto.transaction.TransactionFilter;
import com.financetracker.api.dto.transaction.TransactionRequest;
import com.financetracker.api.dto.transaction.TransactionResponse;
import com.financetracker.api.security.AuthenticatedUser;
import com.financetracker.api.service.TransactionService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping(Routes.Wallets.TRANSACTIONS)
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Transações")
public class TransactionController {
    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    @Operation(summary = "Cria uma transação na carteira")
    ResponseEntity<TransactionResponse> create(
            @AuthenticationPrincipal AuthenticatedUser user,
            @PathVariable("walletId") UUID walletId,
            @Valid @RequestBody TransactionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(transactionService.create(user.id(), walletId, request));
    }

    @GetMapping
    @Operation(summary = "Lista transações da carteira com filtros e paginação")
    PageResponse<TransactionResponse> list(
            @AuthenticationPrincipal AuthenticatedUser user,
            @PathVariable("walletId") UUID walletId,
            @Valid @ModelAttribute TransactionFilter filter) {
        return transactionService.list(user.id(), walletId, filter);
    }

    @GetMapping("/{transactionId}")
    @Operation(summary = "Detalha uma transação")
    TransactionResponse get(
            @AuthenticationPrincipal AuthenticatedUser user,
            @PathVariable("walletId") UUID walletId,
            @PathVariable("transactionId") UUID transactionId) {
        return transactionService.get(user.id(), walletId, transactionId);
    }

    @PutMapping("/{transactionId}")
    @Operation(summary = "Atualiza uma transação")
    TransactionResponse update(
            @AuthenticationPrincipal AuthenticatedUser user,
            @PathVariable("walletId") UUID walletId,
            @PathVariable("transactionId") UUID transactionId,
            @Valid @RequestBody TransactionRequest request) {
        return transactionService.update(user.id(), walletId, transactionId, request);
    }

    @DeleteMapping("/{transactionId}")
    @Operation(summary = "Remove uma transação")
    ResponseEntity<Void> delete(
            @AuthenticationPrincipal AuthenticatedUser user,
            @PathVariable("walletId") UUID walletId,
            @PathVariable("transactionId") UUID transactionId) {
        transactionService.delete(user.id(), walletId, transactionId);
        return ResponseEntity.noContent().build();
    }
}
