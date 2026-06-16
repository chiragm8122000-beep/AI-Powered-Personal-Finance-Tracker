package com.finance.tracker.service;

import com.finance.tracker.dto.BudgetRequest;
import com.finance.tracker.dto.BudgetResponse;
import com.finance.tracker.entity.Budget;
import com.finance.tracker.entity.User;
import com.finance.tracker.repository.BudgetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BudgetService {
    private final BudgetRepository budgetRepository;
    private final UserContextService userContextService;

    public List<BudgetResponse> getBudgets(String month) {
        User user = userContextService.getCurrentUser();

        List<Budget> budgets = month == null || month.isBlank()
                ? budgetRepository.findByUser(user)
                : budgetRepository.findByUserAndMonth(user, month);

        return budgets.stream().map(this::toResponse).toList();
    }

    public BudgetResponse createBudget(BudgetRequest request) {
        User user = userContextService.getCurrentUser();

        budgetRepository.findByUserAndCategoryAndMonth(user, request.getCategory(), request.getMonth())
                .ifPresent(existing -> {
                    throw new IllegalArgumentException("Budget already exists for this category and month");
                });

        Budget budget = Budget.builder()
                .category(request.getCategory())
                .limitAmount(request.getLimitAmount())
                .month(request.getMonth())
                .user(user)
                .build();

        return toResponse(budgetRepository.save(budget));
    }

    public BudgetResponse updateBudget(Long id, BudgetRequest request) {
        User user = userContextService.getCurrentUser();

        Budget budget = budgetRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Budget not found"));

        budget.setCategory(request.getCategory());
        budget.setLimitAmount(request.getLimitAmount());
        budget.setMonth(request.getMonth());

        return toResponse(budgetRepository.save(budget));
    }

    public void deleteBudget(Long id) {
        User user = userContextService.getCurrentUser();

        Budget budget = budgetRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Budget not found"));

        budgetRepository.delete(budget);
    }

    private BudgetResponse toResponse(Budget budget) {
        return BudgetResponse.builder()
                .id(budget.getId())
                .category(budget.getCategory())
                .limitAmount(budget.getLimitAmount())
                .month(budget.getMonth())
                .build();
    }
}
