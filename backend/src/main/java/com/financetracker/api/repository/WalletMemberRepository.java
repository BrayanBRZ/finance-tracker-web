package com.financetracker.api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.financetracker.api.entity.WalletMember;

public interface WalletMemberRepository extends JpaRepository<WalletMember, Long> {
    Optional<WalletMember> findByWalletIdAndUserId(Long walletId, Long userId);

    List<WalletMember> findAllByWalletIdOrderByJoinedAtAsc(Long walletId);

    boolean existsByWalletIdAndUserId(Long walletId, Long userId);
}
