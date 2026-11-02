package com.finance.tracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardSummaryResponse {

    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal netBalance;
    private long totalTransactions;
}
