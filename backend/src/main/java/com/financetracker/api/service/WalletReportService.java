package com.financetracker.api.service;

import java.io.IOException;
import java.time.LocalDate;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.financetracker.api.dto.summary.WalletSummaryResponse;
import com.financetracker.api.exception.ApiException;
import com.financetracker.api.validation.DateRangeValidator;

@Service
public class WalletReportService {
    private final WalletSummaryService summaryService;
    private final WalletAccessService walletAccess;
    private final PdfSummaryRenderer renderer;

    public WalletReportService(
            WalletSummaryService summaryService,
            WalletAccessService walletAccess,
            PdfSummaryRenderer renderer) {
        this.summaryService = summaryService;
        this.walletAccess = walletAccess;
        this.renderer = renderer;
    }

    @Transactional(readOnly = true)
    public byte[] generate(Long userId, UUID walletId, LocalDate startDate, LocalDate endDate) throws IOException {
        if (startDate == null || endDate == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Informe as datas inicial e final do relatório");
        }
        DateRangeValidator.validate(startDate, endDate);

        String walletName = walletAccess.requireMember(walletId, userId).getWallet().getName();
        WalletSummaryResponse summary = summaryService.get(userId, walletId, startDate, endDate);
        return renderer.render(walletName, startDate, endDate, summary);
    }
}
