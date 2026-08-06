package com.financetracker.api.controller;

import java.util.List;

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

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;

@RestController
@RequestMapping(Routes.Wallets.MEMBERS)
@SecurityRequirement(name = "bearerAuth")
public class WalletMemberController {
    private final WalletMemberService walletMemberService;

    public WalletMemberController(WalletMemberService walletMemberService) {
        this.walletMemberService = walletMemberService;
    }

    @GetMapping
    List<WalletMemberResponse> list(
            @AuthenticationPrincipal AuthenticatedUser user,
            @PathVariable("walletId") Long walletId) {
        return walletMemberService.list(user.id(), walletId);
    }

    @PostMapping
    ResponseEntity<WalletMemberResponse> add(
            @AuthenticationPrincipal AuthenticatedUser user,
            @PathVariable("walletId") Long walletId,
            @Valid @RequestBody WalletMemberRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(walletMemberService.add(user.id(), walletId, request));
    }

    @PatchMapping("/{userId}")
    WalletMemberResponse updateRole(
            @AuthenticationPrincipal AuthenticatedUser user,
            @PathVariable("walletId") Long walletId,
            @PathVariable("userId") Long memberUserId,
            @Valid @RequestBody UpdateWalletMemberRoleRequest request) {
        return walletMemberService.updateRole(user.id(), walletId, memberUserId, request);
    }

    @DeleteMapping("/{userId}")
    ResponseEntity<Void> remove(
            @AuthenticationPrincipal AuthenticatedUser user,
            @PathVariable("walletId") Long walletId,
            @PathVariable("userId") Long memberUserId) {
        walletMemberService.remove(user.id(), walletId, memberUserId);
        return ResponseEntity.noContent().build();
    }
}
