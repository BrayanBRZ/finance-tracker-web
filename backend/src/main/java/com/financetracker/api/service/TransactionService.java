package com.financetracker.api.service;

import java.util.Locale;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.financetracker.api.dto.transaction.PageResponse;
import com.financetracker.api.dto.transaction.TransactionFilter;
import com.financetracker.api.dto.transaction.TransactionRequest;
import com.financetracker.api.dto.transaction.TransactionResponse;
import com.financetracker.api.entity.Category;
import com.financetracker.api.entity.Transaction;
import com.financetracker.api.entity.WalletMember;
import com.financetracker.api.exception.ApiException;
import com.financetracker.api.mapper.TransactionMapper;
import com.financetracker.api.repository.CategoryRepository;
import com.financetracker.api.repository.TransactionRepository;
import com.financetracker.api.repository.TransactionSpecifications;
import com.financetracker.api.validation.DateRangeValidator;

@Service
public class TransactionService {
    private static final int DEFAULT_PAGE = 0;
    private static final int DEFAULT_SIZE = 20;
    private static final String DEFAULT_SORT = "date,desc";

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final WalletAccessService walletAccess;

    public TransactionService(
            TransactionRepository transactionRepository,
            CategoryRepository categoryRepository,
            WalletAccessService walletAccess) {
        this.transactionRepository = transactionRepository;
        this.categoryRepository = categoryRepository;
        this.walletAccess = walletAccess;
    }

    @Transactional
    public TransactionResponse create(Long userId, Long walletId, TransactionRequest request) {
        WalletMember member = walletAccess.requireEditor(walletId, userId);
        Category category = resolveCategory(userId, request);
        Transaction transaction = transactionRepository.save(new Transaction(
                member.getWallet(),
                category,
                member.getUser(),
                request.type(),
                request.amount(),
                normalizeDescription(request.description()),
                request.date()));
        return TransactionMapper.toResponse(transaction);
    }

    @Transactional(readOnly = true)
    public PageResponse<TransactionResponse> list(Long userId, Long walletId, TransactionFilter filter) {
        walletAccess.requireMember(walletId, userId);
        DateRangeValidator.validate(filter.startDate(), filter.endDate());

        Page<Transaction> page = transactionRepository.findAll(
                TransactionSpecifications.byWalletAndFilter(walletId, filter),
                PageRequest.of(page(filter), size(filter), sort(filter)));

        return new PageResponse<>(
                page.getContent().stream().map(TransactionMapper::toResponse).toList(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages());
    }

    @Transactional(readOnly = true)
    public TransactionResponse get(Long userId, Long walletId, Long transactionId) {
        walletAccess.requireMember(walletId, userId);
        return TransactionMapper.toResponse(requireTransaction(walletId, transactionId));
    }

    @Transactional
    public TransactionResponse update(Long userId, Long walletId, Long transactionId, TransactionRequest request) {
        walletAccess.requireEditor(walletId, userId);
        Transaction transaction = requireTransaction(walletId, transactionId);
        Category category = resolveCategory(userId, request);
        transaction.update(
                category,
                request.type(),
                request.amount(),
                normalizeDescription(request.description()),
                request.date());
        return TransactionMapper.toResponse(transaction);
    }

    @Transactional
    public void delete(Long userId, Long walletId, Long transactionId) {
        walletAccess.requireEditor(walletId, userId);
        transactionRepository.delete(requireTransaction(walletId, transactionId));
    }

    private Transaction requireTransaction(Long walletId, Long transactionId) {
        return transactionRepository.findByIdAndWalletId(transactionId, walletId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Transação não encontrada"));
    }

    private Category resolveCategory(Long userId, TransactionRequest request) {
        if (request.categoryId() == null) {
            return null;
        }

        Category category = categoryRepository.findByIdAndUserId(request.categoryId(), userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Categoria não encontrada"));
        if (category.getType() != request.type()) {
            throw new ApiException(
                    HttpStatus.UNPROCESSABLE_ENTITY,
                    "O tipo da categoria deve corresponder ao tipo da transação");
        }
        return category;
    }

    private int page(TransactionFilter filter) {
        return filter.page() == null ? DEFAULT_PAGE : filter.page();
    }

    private int size(TransactionFilter filter) {
        return filter.size() == null ? DEFAULT_SIZE : filter.size();
    }

    private Sort sort(TransactionFilter filter) {
        String[] parts = (filter.sort() == null || filter.sort().isBlank() ? DEFAULT_SORT : filter.sort())
                .split(",", -1);
        if (parts.length != 2) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Ordenação inválida");
        }

        String property = switch (parts[0].trim()) {
            case "date" -> "transactionDate";
            case "amount" -> "amount";
            case "createdAt" -> "createdAt";
            default -> throw new ApiException(HttpStatus.BAD_REQUEST, "Campo de ordenação inválido");
        };

        try {
            Sort.Direction direction = Sort.Direction.valueOf(parts[1].trim().toUpperCase(Locale.ROOT));
            return Sort.by(direction, property);
        } catch (IllegalArgumentException exception) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Direção de ordenação inválida");
        }
    }

    private String normalizeDescription(String description) {
        if (description == null || description.isBlank()) {
            return null;
        }
        return description.trim();
    }
}
