package com.financetracker.api.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.financetracker.api.dto.wallet.WalletRequest;
import com.financetracker.api.dto.wallet.WalletResponse;
import com.financetracker.api.entity.User;
import com.financetracker.api.entity.Wallet;
import com.financetracker.api.entity.WalletMember;
import com.financetracker.api.enums.WalletRole;
import com.financetracker.api.mapper.WalletMapper;
import com.financetracker.api.repository.WalletMemberRepository;
import com.financetracker.api.repository.WalletRepository;

@Service
public class WalletService {
    private final WalletRepository walletRepository;
    private final WalletMemberRepository walletMemberRepository;
    private final UserAccessService userAccessService;
    private final WalletAccessService walletAccess;

    public WalletService(
            WalletRepository walletRepository,
            WalletMemberRepository walletMemberRepository,
            UserAccessService userAccessService,
            WalletAccessService walletAccess) {
        this.walletRepository = walletRepository;
        this.walletMemberRepository = walletMemberRepository;
        this.userAccessService = userAccessService;
        this.walletAccess = walletAccess;
    }

    @Transactional
    public WalletResponse create(Long userId, WalletRequest request) {
        User owner = userAccessService.requireUser(userId);

        Wallet wallet = walletRepository.save(new Wallet(owner, request.name().trim(), request.description()));
        walletMemberRepository.save(new WalletMember(wallet, owner, WalletRole.OWNER));
        return WalletMapper.toResponse(wallet, WalletRole.OWNER);
    }

    @Transactional(readOnly = true)
    public List<WalletResponse> list(Long userId) {
        return walletMemberRepository.findAllByUserIdWithWalletAndOwner(userId).stream()
                .map(member -> WalletMapper.toResponse(member.getWallet(), member.getRole()))
                .toList();
    }

    @Transactional(readOnly = true)
    public WalletResponse get(Long userId, Long walletId) {
        WalletMember member = walletAccess.requireMember(walletId, userId);
        return WalletMapper.toResponse(member.getWallet(), member.getRole());
    }

    @Transactional
    public WalletResponse update(Long userId, Long walletId, WalletRequest request) {
        WalletMember owner = walletAccess.requireOwner(walletId, userId);
        Wallet wallet = owner.getWallet();
        wallet.update(request.name().trim(), request.description());
        return WalletMapper.toResponse(wallet, owner.getRole());
    }

    @Transactional
    public void delete(Long userId, Long walletId) {
        WalletMember owner = walletAccess.requireOwner(walletId, userId);
        walletRepository.delete(owner.getWallet());
    }
}
