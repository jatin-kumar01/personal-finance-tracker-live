package com.finance.tracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionResponse {

    private String id;
    private String userId;
    private String title;
    private BigDecimal amount;
    private String type;
    private String category;
    private String description;
    private LocalDate transactionDate;
    private LocalDateTime createdAt;
}
