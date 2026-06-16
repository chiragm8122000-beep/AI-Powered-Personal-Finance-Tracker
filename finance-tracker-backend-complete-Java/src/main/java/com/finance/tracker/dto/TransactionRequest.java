package com.finance.tracker.dto;

import com.finance.tracker.entity.Category;
import com.finance.tracker.entity.TransactionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class TransactionRequest {
    @NotNull
    @Positive
    private BigDecimal amount;

    @NotBlank
    private String description;

    @NotNull
    private Category category;

    @NotNull
    private TransactionType type;

    @NotNull
    private LocalDate transactionDate;
}
