package com.financetracker.api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.financetracker.api.entity.WalletMember;

public interface WalletMemberRepository extends JpaRepository<WalletMember, Long> {
    @Query("select member from WalletMember member "
            + "join fetch member.wallet wallet "
            + "join fetch wallet.owner "
            + "where member.user.id = :userId "
            + "order by wallet.createdAt desc")
    List<WalletMember> findAllByUserIdWithWalletAndOwner(@Param("userId") Long userId);

    Optional<WalletMember> findByWalletIdAndUserId(Long walletId, Long userId);

    @Query("select member from WalletMember member "
            + "join fetch member.user "
            + "where member.wallet.id = :walletId "
            + "order by member.joinedAt asc")
    List<WalletMember> findAllByWalletIdWithUserOrderByJoinedAtAsc(@Param("walletId") Long walletId);

    boolean existsByWalletIdAndUserId(Long walletId, Long userId);
}
