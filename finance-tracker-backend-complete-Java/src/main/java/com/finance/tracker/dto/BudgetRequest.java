package com.finance.tracker.dto;

import com.finance.tracker.entity.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class BudgetRequest {
    @NotNull
    private Category category;

    @NotNull
    @Positive
    private BigDecimal limitAmount;

    @NotBlank
    private String month;
}
