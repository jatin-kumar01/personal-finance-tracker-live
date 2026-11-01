package com.finance.tracker.repository;

import com.finance.tracker.entity.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends MongoRepository<Transaction, String> {


    Optional<Transaction> findByIdAndUserId(String id, String userId);


    List<Transaction> findByUserIdOrderByTransactionDateDesc(String userId);


    List<Transaction> findByUserIdAndCategoryOrderByTransactionDateDesc(String userId, String category);


    List<Transaction> findByUserIdAndTypeOrderByTransactionDateDesc(String userId, String type);


    List<Transaction> findByUserIdAndTransactionDateBetweenOrderByTransactionDateDesc(
            String userId,
            LocalDate startDate,
            LocalDate endDate
    );


    List<Transaction> findByUserIdAndTypeAndTransactionDateBetween(
            String userId,
            String type,
            LocalDate startDate,
            LocalDate endDate
    );


    void deleteByIdAndUserId(String id, String userId);
}
