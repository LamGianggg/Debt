package com.cactus.practice.service;

import com.cactus.practice.dto.PagedResponse;
import com.cactus.practice.dto.PaymentChargeRequest;
import com.cactus.practice.entity.Transaction;

import java.util.List;

public interface TransactionService {
    List<Transaction> getAllTransactions();
    Transaction getTransactionById(String id);
    Transaction createCharge(PaymentChargeRequest request);
    Transaction refundTransaction(String id);
    PagedResponse<Transaction> filterTransactions(String search, int page, int size, String sortBy, String sortDir);
    byte[] exportCsv();
    String exportJson();
}
