package com.cactus.practice.repository;

import com.cactus.practice.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, String>, JpaSpecificationExecutor<Transaction> {
    List<Transaction> findByCustomerIgnoreCaseOrderByCreatedAtDesc(String customer);
    List<Transaction> findByStatusIgnoreCase(String status);
    List<Transaction> findAllByOrderByCreatedAtDesc();
}
