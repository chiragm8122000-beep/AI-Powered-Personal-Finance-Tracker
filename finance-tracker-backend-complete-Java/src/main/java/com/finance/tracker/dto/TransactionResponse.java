package com.finance.tracker.dto;

import com.finance.tracker.entity.Category;
import com.finance.tracker.entity.TransactionType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Builder
public class TransactionResponse {
    private Long id;
    private BigDecimal amount;
    private String description;
    private Category category;
    private TransactionType type;
    private LocalDate transactionDate;
}
