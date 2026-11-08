package com.financetracker.api.service;

import java.io.IOException;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.financetracker.api.repository.WalletMemberRepository;

@Service
public class WalletEventStreamService {
    private final WalletAccessService walletAccess;
    private final WalletMemberRepository walletMemberRepository;
    private final ConcurrentHashMap<Long, Set<Subscriber>> subscribers = new ConcurrentHashMap<>();

    public WalletEventStreamService(WalletAccessService walletAccess, WalletMemberRepository walletMemberRepository) {
        this.walletAccess = walletAccess;
        this.walletMemberRepository = walletMemberRepository;
    }

    public SseEmitter subscribe(Long userId, UUID walletId) {
        Long internalWalletId = walletAccess.requireMember(walletId, userId).getWallet().getId();
        // Reconnect periodically so the JWT is checked again on the next request.
        SseEmitter emitter = new SseEmitter(300000L);
        Subscriber subscriber = new Subscriber(userId, emitter);
        subscribers.computeIfAbsent(internalWalletId, ignored -> new CopyOnWriteArraySet<>()).add(subscriber);

        Runnable cleanup = () -> remove(internalWalletId, subscriber);
        emitter.onCompletion(cleanup);
        emitter.onTimeout(cleanup);
        emitter.onError(ignored -> cleanup.run());
        send(internalWalletId, subscriber, "ready", "connected");
        return emitter;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onTransactionChanged(WalletTransactionChanged event) {
        broadcast(event.walletId(), "transaction-changed", "changed");
    }

    @Scheduled(fixedDelay = 25000)
    public void sendHeartbeats() {
        subscribers.forEach((walletId, walletSubscribers) ->
                walletSubscribers.forEach(subscriber -> send(walletId, subscriber, "heartbeat", "alive")));
    }

    private void broadcast(Long walletId, String eventName, String data) {
        Set<Subscriber> walletSubscribers = subscribers.get(walletId);
        if (walletSubscribers != null) {
            walletSubscribers.forEach(subscriber -> send(walletId, subscriber, eventName, data));
        }
    }

    private void send(Long walletId, Subscriber subscriber, String eventName, String data) {
        if (!walletMemberRepository.existsByWalletIdAndUserId(walletId, subscriber.userId())) {
            remove(walletId, subscriber);
            subscriber.emitter().complete();
            return;
        }
        try {
            subscriber.emitter().send(SseEmitter.event().name(eventName).data(data));
        } catch (IOException | IllegalStateException exception) {
            remove(walletId, subscriber);
            subscriber.emitter().completeWithError(exception);
        }
    }

    private void remove(Long walletId, Subscriber subscriber) {
        subscribers.computeIfPresent(walletId, (ignored, walletSubscribers) -> {
            walletSubscribers.remove(subscriber);
            return walletSubscribers.isEmpty() ? null : walletSubscribers;
        });
    }

    private record Subscriber(Long userId, SseEmitter emitter) {
    }
}
