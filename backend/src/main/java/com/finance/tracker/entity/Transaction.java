package com.finance.tracker.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    private String id;

    @Indexed
    private String userId;

    private String title;

    private BigDecimal amount;

    private String type;

    @Indexed
    private String category;

    private String description;

    @Indexed
    private LocalDate transactionDate;

    private LocalDateTime createdAt;
}
