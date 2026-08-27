package com.financetracker.api.mapper;

import com.financetracker.api.dto.wallet.WalletMemberResponse;
import com.financetracker.api.dto.wallet.WalletResponse;
import com.financetracker.api.entity.Wallet;
import com.financetracker.api.entity.WalletMember;
import com.financetracker.api.enums.WalletRole;

public final class WalletMapper {
    private WalletMapper() {
    }

    public static WalletResponse toResponse(Wallet wallet, WalletRole currentUserRole) {
        return new WalletResponse(
                wallet.getUuid(),
                wallet.getName(),
                wallet.getDescription(),
                UserMapper.toSummary(wallet.getOwner()),
                currentUserRole,
                wallet.getCreatedAt());
    }

    public static WalletMemberResponse toMemberResponse(WalletMember member) {
        return new WalletMemberResponse(
                member.getUuid(),
                UserMapper.toSummary(member.getUser()),
                member.getRole(),
                member.getCreatedAt());
    }
}
