package com.financetracker.api.service;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.request;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.financetracker.api.entity.Wallet;
import com.financetracker.api.entity.WalletMember;
import com.financetracker.api.exception.ApiException;
import com.financetracker.api.repository.WalletMemberRepository;

class WalletEventStreamServiceTest {
    private final WalletAccessService walletAccess = mock(WalletAccessService.class);
    private final WalletMemberRepository members = mock(WalletMemberRepository.class);
    private final WalletEventStreamService streams = new WalletEventStreamService(walletAccess, members);

    @Test
    void onlyWalletMembersCanOpenAStream() {
        UUID walletId = UUID.randomUUID();
        when(walletAccess.requireMember(walletId, 7L))
                .thenThrow(new ApiException(HttpStatus.FORBIDDEN, "Sem acesso"));

        assertThrows(ApiException.class, () -> streams.subscribe(7L, walletId));

        Wallet wallet = mock(Wallet.class);
        WalletMember member = mock(WalletMember.class);
        when(wallet.getId()).thenReturn(11L);
        when(member.getWallet()).thenReturn(wallet);
        when(walletAccess.requireMember(walletId, 8L)).thenReturn(member);
        when(members.existsByWalletIdAndUserId(11L, 8L)).thenReturn(true);

        SseEmitter emitter = streams.subscribe(8L, walletId);
        assertNotNull(emitter);
        verify(members).existsByWalletIdAndUserId(11L, 8L);
        emitter.complete();
    }

    @Test
    void transactionChangeReachesConnectedMember() throws Exception {
        UUID walletId = UUID.randomUUID();
        Wallet wallet = mock(Wallet.class);
        WalletMember member = mock(WalletMember.class);
        when(wallet.getId()).thenReturn(11L);
        when(member.getWallet()).thenReturn(wallet);
        when(walletAccess.requireMember(walletId, 8L)).thenReturn(member);
        when(members.existsByWalletIdAndUserId(11L, 8L)).thenReturn(true);

        EventEndpoint endpoint = new EventEndpoint(walletId, streams);
        MockMvc mvc = MockMvcBuilders.standaloneSetup(endpoint).build();
        MvcResult result = mvc.perform(get("/events"))
                .andExpect(request().asyncStarted())
                .andReturn();

        streams.onTransactionChanged(new WalletTransactionChanged(11L));

        String content = result.getResponse().getContentAsString();
        assertTrue(content.contains("event:ready"));
        assertTrue(content.contains("event:transaction-changed"));
        endpoint.emitter.complete();
    }

    @RestController
    private static class EventEndpoint {
        private final UUID walletId;
        private final WalletEventStreamService streams;
        private SseEmitter emitter;

        private EventEndpoint(UUID walletId, WalletEventStreamService streams) {
            this.walletId = walletId;
            this.streams = streams;
        }

        @GetMapping("/events")
        SseEmitter events() {
            emitter = streams.subscribe(8L, walletId);
            return emitter;
        }
    }
}
