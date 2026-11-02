package com.finance.tracker.service;

import com.finance.tracker.dto.CategorySummaryResponse;
import com.finance.tracker.dto.DashboardSummaryResponse;
import com.finance.tracker.dto.MonthlySummaryResponse;
import com.finance.tracker.entity.Transaction;
import com.finance.tracker.exception.BadRequestException;
import com.finance.tracker.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    private final TransactionRepository transactionRepository;

    public DashboardService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public DashboardSummaryResponse getOverallSummary(String userId) {
        List<Transaction> transactions = transactionRepository.findByUserIdOrderByTransactionDateDesc(userId);

        BigDecimal totalIncome = BigDecimal.ZERO;
        BigDecimal totalExpense = BigDecimal.ZERO;

        for (Transaction t : transactions) {
            if ("INCOME".equalsIgnoreCase(t.getType())) {
                totalIncome = totalIncome.add(t.getAmount());
            } else if ("EXPENSE".equalsIgnoreCase(t.getType())) {
                totalExpense = totalExpense.add(t.getAmount());
            }
        }

        BigDecimal netBalance = totalIncome.subtract(totalExpense);

        return DashboardSummaryResponse.builder()
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .netBalance(netBalance)
                .totalTransactions(transactions.size())
                .build();
    }

    public MonthlySummaryResponse getMonthlySummary(String userId, int year, int month) {
        if (month < 1 || month > 12) {
            throw new BadRequestException("Month must be between 1 and 12");
        }

        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        List<Transaction> monthlyTransactions = transactionRepository
                .findByUserIdAndTransactionDateBetweenOrderByTransactionDateDesc(userId, startDate, endDate);

        BigDecimal totalIncome = BigDecimal.ZERO;
        BigDecimal totalExpense = BigDecimal.ZERO;

        for (Transaction t : monthlyTransactions) {
            if ("INCOME".equalsIgnoreCase(t.getType())) {
                totalIncome = totalIncome.add(t.getAmount());
            } else if ("EXPENSE".equalsIgnoreCase(t.getType())) {
                totalExpense = totalExpense.add(t.getAmount());
            }
        }

        BigDecimal netSavings = totalIncome.subtract(totalExpense);

        return MonthlySummaryResponse.builder()
                .year(year)
                .month(month)
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .netSavings(netSavings)
                .build();
    }

    public List<CategorySummaryResponse> getCategorySummary(String userId, String type) {
        List<Transaction> transactions;

        if (type != null && !type.trim().isEmpty()) {
            String upperType = type.trim().toUpperCase();
            if (!upperType.equals("INCOME") && !upperType.equals("EXPENSE")) {
                throw new BadRequestException("Type must be either INCOME or EXPENSE");
            }
            transactions = transactionRepository.findByUserIdAndTypeOrderByTransactionDateDesc(userId, upperType);
        } else {
            transactions = transactionRepository.findByUserIdOrderByTransactionDateDesc(userId);
        }


        Map<String, BigDecimal> amountMap = new HashMap<>();
        Map<String, Long> countMap = new HashMap<>();
        Map<String, String> typeMap = new HashMap<>();

        for (Transaction t : transactions) {
            String category = t.getCategory();
            BigDecimal currentAmount = amountMap.getOrDefault(category, BigDecimal.ZERO);
            amountMap.put(category, currentAmount.add(t.getAmount()));

            long currentCount = countMap.getOrDefault(category, 0L);
            countMap.put(category, currentCount + 1);

            typeMap.putIfAbsent(category, t.getType());
        }

        List<CategorySummaryResponse> summaries = new ArrayList<>();
        for (String category : amountMap.keySet()) {
            summaries.add(CategorySummaryResponse.builder()
                    .category(category)
                    .totalAmount(amountMap.get(category))
                    .transactionCount(countMap.get(category))
                    .type(typeMap.get(category))
                    .build());
        }

        return summaries;
    }
}
