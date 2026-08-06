package com.financetracker.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.financetracker.api.entity.Wallet;

public interface WalletRepository extends JpaRepository<Wallet, Long> {
    @Query("select distinct wallet from Wallet wallet join wallet.members member "
            + "where member.user.id = :userId order by wallet.createdAt desc")
    List<Wallet> findAllByMemberUserId(@Param("userId") Long userId);
}
