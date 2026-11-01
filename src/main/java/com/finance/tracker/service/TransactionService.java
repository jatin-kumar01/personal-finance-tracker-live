package com.finance.tracker.service;

import com.finance.tracker.dto.TransactionRequest;
import com.finance.tracker.dto.TransactionResponse;
import com.finance.tracker.entity.Transaction;
import com.finance.tracker.exception.BadRequestException;
import com.finance.tracker.exception.ResourceNotFoundException;
import com.finance.tracker.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public TransactionResponse createTransaction(String userId, TransactionRequest request) {
        Transaction transaction = Transaction.builder()
                .userId(userId)
                .title(request.getTitle().trim())
                .amount(request.getAmount())
                .type(request.getType().trim().toUpperCase())
                .category(request.getCategory().trim())
                .description(request.getDescription())
                .transactionDate(request.getTransactionDate())
                .createdAt(LocalDateTime.now())
                .build();

        Transaction savedTransaction = transactionRepository.save(transaction);
        return mapToResponse(savedTransaction);
    }

    public List<TransactionResponse> getTransactions(String userId, String category, String type, LocalDate startDate, LocalDate endDate) {
        List<Transaction> transactions;


        if (startDate != null && endDate != null) {
            if (startDate.isAfter(endDate)) {
                throw new BadRequestException("Start date cannot be after end date");
            }
            transactions = transactionRepository.findByUserIdAndTransactionDateBetweenOrderByTransactionDateDesc(userId, startDate, endDate);
        }

        else if (category != null && !category.trim().isEmpty()) {
            transactions = transactionRepository.findByUserIdAndCategoryOrderByTransactionDateDesc(userId, category.trim());
        }

        else if (type != null && !type.trim().isEmpty()) {
            String upperType = type.trim().toUpperCase();
            if (!upperType.equals("INCOME") && !upperType.equals("EXPENSE")) {
                throw new BadRequestException("Transaction type must be either INCOME or EXPENSE");
            }
            transactions = transactionRepository.findByUserIdAndTypeOrderByTransactionDateDesc(userId, upperType);
        }

        else {
            transactions = transactionRepository.findByUserIdOrderByTransactionDateDesc(userId);
        }

        List<TransactionResponse> responses = new ArrayList<>();
        for (Transaction transaction : transactions) {
            responses.add(mapToResponse(transaction));
        }
        return responses;
    }

    public TransactionResponse getTransactionById(String userId, String id) {
        Transaction transaction = transactionRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));

        return mapToResponse(transaction);
    }

    public TransactionResponse updateTransaction(String userId, String id, TransactionRequest request) {
        Transaction existingTransaction = transactionRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));

        existingTransaction.setTitle(request.getTitle().trim());
        existingTransaction.setAmount(request.getAmount());
        existingTransaction.setType(request.getType().trim().toUpperCase());
        existingTransaction.setCategory(request.getCategory().trim());
        existingTransaction.setDescription(request.getDescription());
        existingTransaction.setTransactionDate(request.getTransactionDate());

        Transaction updatedTransaction = transactionRepository.save(existingTransaction);
        return mapToResponse(updatedTransaction);
    }

    public void deleteTransaction(String userId, String id) {

        Transaction existingTransaction = transactionRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));

        transactionRepository.delete(existingTransaction);
    }

    private TransactionResponse mapToResponse(Transaction transaction) {
        return TransactionResponse.builder()
                .id(transaction.getId())
                .userId(transaction.getUserId())
                .title(transaction.getTitle())
                .amount(transaction.getAmount())
                .type(transaction.getType())
                .category(transaction.getCategory())
                .description(transaction.getDescription())
                .transactionDate(transaction.getTransactionDate())
                .createdAt(transaction.getCreatedAt())
                .build();
    }
}
