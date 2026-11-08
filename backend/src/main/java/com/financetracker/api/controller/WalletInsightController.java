package com.financetracker.api.controller;

import java.util.UUID;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.financetracker.api.Routes;
import com.financetracker.api.dto.insight.InsightRequest;
import com.financetracker.api.dto.insight.InsightResponse;
import com.financetracker.api.security.AuthenticatedUser;
import com.financetracker.api.service.WalletInsightService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping(Routes.Wallets.INSIGHTS)
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Análise financeira por IA")
public class WalletInsightController {
        private final WalletInsightService insights;

        public WalletInsightController(WalletInsightService insights) {
                this.insights = insights;
        }

        @PostMapping
        @Operation(summary = "Gera uma análise por IA dos dados agregados da carteira", description = "Disponível a qualquer membro, inclusive VIEWER. Período inclusivo de até 366 dias. "
                        + "Sem movimentações, não chama o provedor. Cache privado da aplicação por 10 minutos.")
        @ApiResponse(responseCode = "200", description = "Análise gerada, reutilizada ou período vazio")
        @ApiResponse(responseCode = "400", description = "Datas inválidas ou intervalo acima de 366 dias")
        @ApiResponse(responseCode = "401", description = "JWT ausente ou inválido")
        @ApiResponse(responseCode = "403", description = "Usuário não é membro da carteira")
        @ApiResponse(responseCode = "409", description = "Dados alterados durante a geração")
        @ApiResponse(responseCode = "429", description = "Limite de solicitações ou geração em andamento")
        @ApiResponse(responseCode = "502", description = "Resposta inválida do provedor")
        @ApiResponse(responseCode = "503", description = "IA desabilitada, não configurada ou indisponível")
        @ApiResponse(responseCode = "504", description = "Tempo limite excedido")
        public ResponseEntity<InsightResponse> generate(@AuthenticationPrincipal AuthenticatedUser user,
                        @PathVariable UUID walletId, @Valid @RequestBody InsightRequest request) {
                return ResponseEntity.ok().cacheControl(CacheControl.noStore())
                                .body(insights.generate(user.id(), walletId, request));
        }
}
