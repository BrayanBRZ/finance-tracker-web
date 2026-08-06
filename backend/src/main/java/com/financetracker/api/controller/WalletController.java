package com.financetracker.api.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.financetracker.api.Routes;
import com.financetracker.api.dto.wallet.WalletRequest;
import com.financetracker.api.dto.wallet.WalletResponse;
import com.financetracker.api.security.AuthenticatedUser;
import com.financetracker.api.service.WalletService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping(Routes.Wallets.BASE)
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Carteiras")
public class WalletController {
    private final WalletService walletService;

    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    @GetMapping
    @Operation(summary = "Lista as carteiras do usuario")
    List<WalletResponse> list(@AuthenticationPrincipal AuthenticatedUser user) {
        return walletService.list(user.id());
    }

    @PostMapping
    @Operation(summary = "Cria uma carteira")
    ResponseEntity<WalletResponse> create(
            @AuthenticationPrincipal AuthenticatedUser user,
            @Valid @RequestBody WalletRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(walletService.create(user.id(), request));
    }

    @GetMapping(Routes.Wallets.BY_ID)
    @Operation(summary = "Detalha uma carteira")
    WalletResponse get(
            @AuthenticationPrincipal AuthenticatedUser user,
            @PathVariable("walletId") Long walletId) {
        return walletService.get(user.id(), walletId);
    }

    @PutMapping(Routes.Wallets.BY_ID)
    @Operation(summary = "Atualiza uma carteira como proprietario")
    WalletResponse update(
            @AuthenticationPrincipal AuthenticatedUser user,
            @PathVariable("walletId") Long walletId,
            @Valid @RequestBody WalletRequest request) {
        return walletService.update(user.id(), walletId, request);
    }

    @DeleteMapping(Routes.Wallets.BY_ID)
    @Operation(summary = "Remove uma carteira como proprietario")
    ResponseEntity<Void> delete(
            @AuthenticationPrincipal AuthenticatedUser user,
            @PathVariable("walletId") Long walletId) {
        walletService.delete(user.id(), walletId);
        return ResponseEntity.noContent().build();
    }
}
