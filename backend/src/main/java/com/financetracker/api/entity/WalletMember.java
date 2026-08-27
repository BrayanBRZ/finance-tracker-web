package com.financetracker.api.entity;

import com.financetracker.api.enums.WalletRole;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;

@Entity
@Getter
@Table(name = "wallet_members", uniqueConstraints = @UniqueConstraint(name = "uk_wallet_members_wallet_user", columnNames = {
        "wallet_id", "user_id" }))
public class WalletMember extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "wallet_id", nullable = false)
    private Wallet wallet;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private WalletRole role;

    protected WalletMember() {
    }

    public WalletMember(Wallet wallet, User user, WalletRole role) {
        this.wallet = wallet;
        this.user = user;
        this.role = role;
    }

    public void changeRole(WalletRole role) {
        this.role = role;
    }
}
