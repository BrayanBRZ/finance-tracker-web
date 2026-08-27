package com.financetracker.api.service;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.financetracker.api.dto.wallet.UpdateWalletMemberRoleRequest;
import com.financetracker.api.dto.wallet.WalletMemberRequest;
import com.financetracker.api.dto.wallet.WalletMemberResponse;
import com.financetracker.api.entity.User;
import com.financetracker.api.entity.Wallet;
import com.financetracker.api.entity.WalletMember;
import com.financetracker.api.enums.WalletRole;
import com.financetracker.api.exception.ApiException;
import com.financetracker.api.mapper.WalletMapper;
import com.financetracker.api.repository.WalletMemberRepository;
import com.financetracker.api.util.EmailNormalizer;

@Service
public class WalletMemberService {
    private final WalletMemberRepository walletMemberRepository;
    private final UserAccessService userAccessService;
    private final WalletAccessService walletAccess;

    public WalletMemberService(
            WalletMemberRepository walletMemberRepository,
            UserAccessService userAccessService,
            WalletAccessService walletAccess) {
        this.walletMemberRepository = walletMemberRepository;
        this.userAccessService = userAccessService;
        this.walletAccess = walletAccess;
    }

    @Transactional
    public WalletMemberResponse add(Long requesterId, UUID walletId, WalletMemberRequest request) {
        Wallet wallet = walletAccess.requireOwner(walletId, requesterId).getWallet();
        rejectOwnerRole(request.role());

        User user = userAccessService.requireUserByEmail(EmailNormalizer.normalize(request.email()));
        if (walletMemberRepository.existsByWalletIdAndUserId(wallet.getId(), user.getId())) {
            throw new ApiException(HttpStatus.CONFLICT, "Este usuário já é membro da carteira");
        }

        WalletMember member = walletMemberRepository.save(new WalletMember(wallet, user, request.role()));
        return WalletMapper.toMemberResponse(member);
    }

    @Transactional(readOnly = true)
    public List<WalletMemberResponse> list(Long requesterId, UUID walletId) {
        Wallet wallet = walletAccess.requireMember(walletId, requesterId).getWallet();
        return walletMemberRepository.findAllByWalletIdWithUserOrderByCreatedAtAsc(wallet.getId()).stream()
                .map(WalletMapper::toMemberResponse)
                .toList();
    }

    @Transactional
    public WalletMemberResponse updateRole(
            Long requesterId,
            UUID walletId,
            UUID memberUserId,
            UpdateWalletMemberRoleRequest request) {
        Wallet wallet = walletAccess.requireOwner(walletId, requesterId).getWallet();
        rejectOwnerRole(request.role());
        WalletMember member = requireMember(wallet.getId(), memberUserId);
        rejectOwnerMember(member);
        member.changeRole(request.role());
        return WalletMapper.toMemberResponse(member);
    }

    @Transactional
    public void remove(Long requesterId, UUID walletId, UUID memberUserId) {
        Wallet wallet = walletAccess.requireOwner(walletId, requesterId).getWallet();
        WalletMember member = requireMember(wallet.getId(), memberUserId);
        rejectOwnerMember(member);
        walletMemberRepository.delete(member);
    }

    private WalletMember requireMember(Long internalWalletId, UUID userId) {
        return walletMemberRepository.findByWalletIdAndUserUuid(internalWalletId, userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Membro da carteira não encontrado"));
    }

    private void rejectOwnerRole(WalletRole role) {
        if (role == WalletRole.OWNER) {
            throw new ApiException(HttpStatus.UNPROCESSABLE_ENTITY, "Não é permitido adicionar outro proprietário");
        }
    }

    private void rejectOwnerMember(WalletMember member) {
        if (member.getRole() == WalletRole.OWNER) {
            throw new ApiException(HttpStatus.UNPROCESSABLE_ENTITY, "O proprietário não pode ser alterado ou removido");
        }
    }
}
