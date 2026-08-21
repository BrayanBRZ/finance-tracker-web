package com.financetracker.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.financetracker.api.entity.Wallet;

public interface WalletRepository extends JpaRepository<Wallet, Long> {
}
