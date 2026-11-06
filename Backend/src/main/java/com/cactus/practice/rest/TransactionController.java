package com.cactus.practice.rest;

import com.cactus.practice.dto.ApiResponse;
import com.cactus.practice.dto.PagedResponse;
import com.cactus.practice.dto.PaymentChargeRequest;
import com.cactus.practice.entity.Transaction;
import com.cactus.practice.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@Tag(name = "Transactions & Payments", description = "Endpoints for managing healthcare payments, debt collections, charges, and refunds")
public class TransactionController {

    private final TransactionService transactionService;

    @Autowired
    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping
    @Operation(summary = "Get all transactions ordered by most recent")
    public ResponseEntity<ApiResponse<List<Transaction>>> getAllTransactions() {
        List<Transaction> list = transactionService.getAllTransactions();
        return ResponseEntity.ok(ApiResponse.ok("Transactions retrieved successfully", list));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get transaction details by ID")
    public ResponseEntity<ApiResponse<Transaction>> getTransactionById(@PathVariable String id) {
        Transaction tx = transactionService.getTransactionById(id);
        return ResponseEntity.ok(ApiResponse.ok("Transaction retrieved successfully", tx));
    }

    @PostMapping
    @Operation(summary = "Create a new payment charge")
    public ResponseEntity<ApiResponse<Transaction>> createCharge(@Valid @RequestBody PaymentChargeRequest request) {
        Transaction created = transactionService.createCharge(request);
        return ResponseEntity.ok(ApiResponse.ok("Payment charged successfully", created));
    }

    @PostMapping("/{id}/refund")
    @Operation(summary = "Refund an existing transaction")
    public ResponseEntity<ApiResponse<Transaction>> refundTransaction(@PathVariable String id) {
        Transaction refunded = transactionService.refundTransaction(id);
        return ResponseEntity.ok(ApiResponse.ok("Transaction refunded successfully", refunded));
    }

    @GetMapping("/filter")
    @Operation(summary = "Filter transactions using Unified HibernateDao (search criteria, pagination, sort)")
    public ResponseEntity<ApiResponse<PagedResponse<Transaction>>> filterTransactions(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir
    ) {
        PagedResponse<Transaction> result = transactionService.filterTransactions(search, page, size, sortBy, sortDir);
        return ResponseEntity.ok(ApiResponse.ok("Filtered transactions retrieved", result));
    }

    @GetMapping("/export/csv")
    @Operation(summary = "Export all transactions in CSV format")
    public ResponseEntity<byte[]> exportCsv() {
        byte[] csvData = transactionService.exportCsv();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"cactus_transactions.csv\"")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(csvData);
    }

    @GetMapping("/export/json")
    @Operation(summary = "Export all transactions in JSON format")
    public ResponseEntity<String> exportJson() {
        String jsonData = transactionService.exportJson();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"cactus_transactions.json\"")
                .contentType(MediaType.APPLICATION_JSON)
                .body(jsonData);
    }
}
