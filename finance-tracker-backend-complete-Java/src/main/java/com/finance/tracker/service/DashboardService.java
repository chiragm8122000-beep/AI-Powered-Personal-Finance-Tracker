package com.finance.tracker.service;

import com.finance.tracker.dto.BudgetActualResponse;
import com.finance.tracker.dto.DashboardResponse;
import com.finance.tracker.entity.Budget;
import com.finance.tracker.entity.Category;
import com.finance.tracker.entity.Transaction;
import com.finance.tracker.entity.TransactionType;
import com.finance.tracker.entity.User;
import com.finance.tracker.repository.BudgetRepository;
import com.finance.tracker.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;
    private final UserContextService userContextService;

    public DashboardResponse getSummary(String month) {
        User user = userContextService.getCurrentUser();
        YearMonth yearMonth = month == null || month.isBlank() ? YearMonth.now() : YearMonth.parse(month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        List<Transaction> transactions = transactionRepository.findByUserAndTransactionDateBetween(user, startDate, endDate);
        List<Budget> budgets = budgetRepository.findByUserAndMonth(user, yearMonth.toString());

        BigDecimal totalIncome = sumByType(transactions, TransactionType.INCOME);
        BigDecimal totalExpense = sumByType(transactions, TransactionType.EXPENSE);
        BigDecimal totalBudget = budgets.stream()
                .map(Budget::getLimitAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<Category, BigDecimal> expenseByCategoryEnum = new EnumMap<>(Category.class);
        for (Transaction transaction : transactions) {
            if (transaction.getType() == TransactionType.EXPENSE) {
                expenseByCategoryEnum.merge(transaction.getCategory(), transaction.getAmount(), BigDecimal::add);
            }
        }

        List<BudgetActualResponse> budgetVsActual = budgets.stream()
                .map(budget -> buildBudgetActual(budget, expenseByCategoryEnum.getOrDefault(budget.getCategory(), BigDecimal.ZERO)))
                .toList();

        Map<String, BigDecimal> expenseByCategory = expenseByCategoryEnum.entrySet()
                .stream()
                .collect(Collectors.toMap(entry -> entry.getKey().name(), Map.Entry::getValue));

        return DashboardResponse.builder()
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .balance(totalIncome.subtract(totalExpense))
                .totalBudget(totalBudget)
                .remainingBudget(totalBudget.subtract(totalExpense))
                .budgetVsActual(budgetVsActual)
                .expenseByCategory(expenseByCategory)
                .build();
    }

    private BigDecimal sumByType(List<Transaction> transactions, TransactionType type) {
        return transactions.stream()
                .filter(transaction -> transaction.getType() == type)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BudgetActualResponse buildBudgetActual(Budget budget, BigDecimal spentAmount) {
        BigDecimal remaining = budget.getLimitAmount().subtract(spentAmount);
        double percentage = budget.getLimitAmount().compareTo(BigDecimal.ZERO) == 0
                ? 0
                : spentAmount.multiply(BigDecimal.valueOf(100))
                    .divide(budget.getLimitAmount(), 2, RoundingMode.HALF_UP)
                    .doubleValue();

        String status;
        if (percentage >= 100) {
            status = "RED";
        } else if (percentage >= 80) {
            status = "YELLOW";
        } else {
            status = "GREEN";
        }

        return BudgetActualResponse.builder()
                .category(budget.getCategory())
                .budgetAmount(budget.getLimitAmount())
                .spentAmount(spentAmount)
                .remainingAmount(remaining)
                .usedPercentage(percentage)
                .status(status)
                .build();
    }
}
