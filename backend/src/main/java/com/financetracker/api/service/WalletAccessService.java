package com.financetracker.api.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.financetracker.api.entity.Wallet;
import com.financetracker.api.entity.WalletMember;
import com.financetracker.api.enums.WalletRole;
import com.financetracker.api.exception.ApiException;
import com.financetracker.api.repository.WalletMemberRepository;
import com.financetracker.api.repository.WalletRepository;

@Service
public class WalletAccessService {
    private final WalletRepository walletRepository;
    private final WalletMemberRepository walletMemberRepository;

    public WalletAccessService(
            WalletRepository walletRepository,
            WalletMemberRepository walletMemberRepository) {
        this.walletRepository = walletRepository;
        this.walletMemberRepository = walletMemberRepository;
    }

    @Transactional(readOnly = true)
    public WalletMember requireMember(Long walletId, Long userId) {
        requireWallet(walletId);
        return walletMemberRepository.findByWalletIdAndUserId(walletId, userId)
                .orElseThrow(() -> new ApiException(HttpStatus.FORBIDDEN, "Você não possui acesso a esta carteira"));
    }

    @Transactional(readOnly = true)
    public WalletMember requireOwner(Long walletId, Long userId) {
        WalletMember member = requireMember(walletId, userId);
        if (member.getRole() != WalletRole.OWNER) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Apenas o proprietário pode alterar esta carteira");
        }
        return member;
    }

    @Transactional(readOnly = true)
    public WalletMember requireEditor(Long walletId, Long userId) {
        WalletMember member = requireMember(walletId, userId);
        if (member.getRole() == WalletRole.VIEWER) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Você não possui permissão para alterar esta carteira");
        }
        return member;
    }

    @Transactional(readOnly = true)
    public Wallet requireWallet(Long walletId) {
        return walletRepository.findById(walletId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Carteira não encontrada"));
    }
}
