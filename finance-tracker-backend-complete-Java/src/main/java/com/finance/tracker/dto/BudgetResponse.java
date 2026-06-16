package com.finance.tracker.dto;

import com.finance.tracker.entity.Category;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
public class BudgetResponse {
    private Long id;
    private Category category;
    private BigDecimal limitAmount;
    private String month;
}
