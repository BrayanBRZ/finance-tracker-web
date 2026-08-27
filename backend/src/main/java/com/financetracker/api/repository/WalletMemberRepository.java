package com.financetracker.api.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.financetracker.api.entity.WalletMember;

public interface WalletMemberRepository extends BaseRepository<WalletMember> {
    @Query("select member from WalletMember member "
            + "join fetch member.wallet wallet "
            + "join fetch wallet.owner "
            + "where member.user.id = :userId "
            + "order by wallet.createdAt desc")
    List<WalletMember> findAllByUserIdWithWalletAndOwner(@Param("userId") Long userId);

    Optional<WalletMember> findByWalletIdAndUserId(Long walletId, Long userId);

    Optional<WalletMember> findByWalletIdAndUserUuid(Long walletId, UUID userUuid);

    @Query("select member from WalletMember member "
            + "join fetch member.user "
            + "where member.wallet.id = :walletId "
            + "order by member.createdAt asc")
    List<WalletMember> findAllByWalletIdWithUserOrderByCreatedAtAsc(@Param("walletId") Long walletId);

    boolean existsByWalletIdAndUserId(Long walletId, Long userId);
}
