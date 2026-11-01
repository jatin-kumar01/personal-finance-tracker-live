package com.finance.tracker.controller;

import com.finance.tracker.dto.TransactionRequest;
import com.finance.tracker.dto.TransactionResponse;
import com.finance.tracker.security.CustomUserDetails;
import com.finance.tracker.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody TransactionRequest request
    ) {
        TransactionResponse response = transactionService.createTransaction(userDetails.getId(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getTransactions(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        List<TransactionResponse> responses = transactionService.getTransactions(
                userDetails.getId(),
                category,
                type,
                startDate,
                endDate
        );
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponse> getTransactionById(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable String id
    ) {
        TransactionResponse response = transactionService.getTransactionById(userDetails.getId(), id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponse> updateTransaction(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable String id,
            @Valid @RequestBody TransactionRequest request
    ) {
        TransactionResponse response = transactionService.updateTransaction(userDetails.getId(), id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteTransaction(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable String id
    ) {
        transactionService.deleteTransaction(userDetails.getId(), id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Transaction deleted successfully");
        return ResponseEntity.ok(response);
    }
}
