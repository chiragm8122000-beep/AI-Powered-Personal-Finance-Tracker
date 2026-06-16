package com.finance.tracker.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@Builder
public class DashboardResponse {
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal balance;
    private BigDecimal totalBudget;
    private BigDecimal remainingBudget;
    private List<BudgetActualResponse> budgetVsActual;
    private Map<String, BigDecimal> expenseByCategory;
}
