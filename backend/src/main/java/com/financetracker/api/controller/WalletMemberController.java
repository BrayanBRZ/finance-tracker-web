package com.financetracker.api.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.financetracker.api.Routes;
import com.financetracker.api.dto.wallet.UpdateWalletMemberRoleRequest;
import com.financetracker.api.dto.wallet.WalletMemberRequest;
import com.financetracker.api.dto.wallet.WalletMemberResponse;
import com.financetracker.api.security.AuthenticatedUser;
import com.financetracker.api.service.WalletMemberService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping(Routes.Wallets.MEMBERS)
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Membros da carteira")
public class WalletMemberController {
    private final WalletMemberService walletMemberService;

    public WalletMemberController(WalletMemberService walletMemberService) {
        this.walletMemberService = walletMemberService;
    }

    @PostMapping
    @Operation(summary = "Adiciona um membro a carteira")
    ResponseEntity<WalletMemberResponse> add(
            @AuthenticationPrincipal AuthenticatedUser user,
            @PathVariable("walletId") UUID walletId,
            @Valid @RequestBody WalletMemberRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(walletMemberService.add(user.id(), walletId, request));
    }

    @GetMapping
    @Operation(summary = "Lista os membros da carteira")
    List<WalletMemberResponse> list(
            @AuthenticationPrincipal AuthenticatedUser user,
            @PathVariable("walletId") UUID walletId) {
        return walletMemberService.list(user.id(), walletId);
    }

    @PatchMapping("/{userId}")
    @Operation(summary = "Altera o papel de um membro")
    WalletMemberResponse updateRole(
            @AuthenticationPrincipal AuthenticatedUser user,
            @PathVariable("walletId") UUID walletId,
            @PathVariable("userId") UUID memberUserId,
            @Valid @RequestBody UpdateWalletMemberRoleRequest request) {
        return walletMemberService.updateRole(user.id(), walletId, memberUserId, request);
    }

    @DeleteMapping("/{userId}")
    @Operation(summary = "Remove um membro da carteira")
    ResponseEntity<Void> remove(
            @AuthenticationPrincipal AuthenticatedUser user,
            @PathVariable("walletId") UUID walletId,
            @PathVariable("userId") UUID memberUserId) {
        walletMemberService.remove(user.id(), walletId, memberUserId);
        return ResponseEntity.noContent().build();
    }
}
