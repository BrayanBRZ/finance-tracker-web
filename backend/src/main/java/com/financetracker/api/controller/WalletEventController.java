package com.financetracker.api.controller;

import java.util.UUID;

import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.financetracker.api.Routes;
import com.financetracker.api.security.AuthenticatedUser;
import com.financetracker.api.service.WalletEventStreamService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping(Routes.Wallets.EVENTS)
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Eventos da carteira")
public class WalletEventController {
    private final WalletEventStreamService eventStream;

    public WalletEventController(WalletEventStreamService eventStream) {
        this.eventStream = eventStream;
    }

    @GetMapping(produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @Operation(summary = "Acompanha alterações de transações da carteira em tempo real")
    public ResponseEntity<SseEmitter> subscribe(
            @AuthenticationPrincipal AuthenticatedUser user,
            @PathVariable("walletId") UUID walletId) {
        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_EVENT_STREAM)
                .cacheControl(CacheControl.noStore())
                .header("X-Accel-Buffering", "no")
                .body(eventStream.subscribe(user.id(), walletId));
    }
}
