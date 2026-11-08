package com.financetracker.api.service;

import com.financetracker.api.dto.insight.InsightContent;
import com.financetracker.api.dto.insight.InsightContext;

public interface FinancialInsightProvider {
    InsightContent generate(InsightContext context);
}
