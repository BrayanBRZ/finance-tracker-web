package com.financetracker.api.validation;

import java.time.LocalDate;

import org.springframework.http.HttpStatus;

import com.financetracker.api.exception.ApiException;

public final class DateRangeValidator {
    private DateRangeValidator() {
    }

    public static void validate(LocalDate startDate, LocalDate endDate) {
        if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "A data inicial deve ser anterior ou igual à data final");
        }
    }
}
