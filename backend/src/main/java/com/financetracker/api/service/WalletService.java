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
import com.financetracker.api.exception.ApiException;
import com.financetracker.api.mapper.WalletMapper;
import com.financetracker.api.repository.UserRepository;
import com.financetracker.api.repository.WalletMemberRepository;
import com.financetracker.api.repository.WalletRepository;
import org.springframework.http.HttpStatus;

@Service
public class WalletService {
    private final WalletRepository wallets;
    private final WalletMemberRepository members;
    private final UserRepository users;
    private final WalletAccessService walletAccess;

    public WalletService(
            WalletRepository wallets,
            WalletMemberRepository members,
            UserRepository users,
            WalletAccessService walletAccess) {
        this.wallets = wallets;
        this.members = members;
        this.users = users;
        this.walletAccess = walletAccess;
    }

    @Transactional(readOnly = true)
    public List<WalletResponse> list(Long userId) {
        return wallets.findAllByMemberUserId(userId).stream()
                .map(wallet -> WalletMapper.toResponse(wallet, currentRole(wallet.getId(), userId)))
                .toList();
    }

    @Transactional
    public WalletResponse create(Long userId, WalletRequest request) {
        User owner = users.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
                
        Wallet wallet = wallets.save(new Wallet(owner, request.name().trim(), request.description()));
        members.save(new WalletMember(wallet, owner, WalletRole.OWNER));
        return WalletMapper.toResponse(wallet, WalletRole.OWNER);
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
        wallets.delete(owner.getWallet());
    }

    private WalletRole currentRole(Long walletId, Long userId) {
        return members.findByWalletIdAndUserId(walletId, userId)
                .orElseThrow(() -> new ApiException(HttpStatus.FORBIDDEN, "Você não possui acesso a esta carteira"))
                .getRole();
    }
}
