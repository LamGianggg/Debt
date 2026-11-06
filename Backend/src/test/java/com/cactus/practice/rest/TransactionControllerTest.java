package com.cactus.practice.rest;

import com.cactus.practice.dto.PaymentChargeRequest;
import com.cactus.practice.entity.Transaction;
import com.cactus.practice.exception.GlobalExceptionHandler;
import com.cactus.practice.service.TransactionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class TransactionControllerTest {

    private MockMvc mockMvc;

    @Mock
    private TransactionService transactionService;

    @InjectMocks
    private TransactionController transactionController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(transactionController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void testGetAllTransactions() throws Exception {
        Transaction tx = new Transaction("ch_1", "$100.00 USD", "$100.00 USD", "-$3.20 USD", "$96.80 USD", "Succeeded", "success", "Hoang Phat", "hp@example.com", "Visa", "Nov 01, 2026", new BigDecimal("100.00"), "Debt settlement");
        when(transactionService.getAllTransactions()).thenReturn(Collections.singletonList(tx));

        mockMvc.perform(get("/api/transactions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].id").value("ch_1"));
    }

    @Test
    void testGetTransactionById() throws Exception {
        Transaction tx = new Transaction("ch_1", "$100.00 USD", "$100.00 USD", "-$3.20 USD", "$96.80 USD", "Succeeded", "success", "Hoang Phat", "hp@example.com", "Visa", "Nov 01, 2026", new BigDecimal("100.00"), "Debt settlement");
        when(transactionService.getTransactionById("ch_1")).thenReturn(tx);

        mockMvc.perform(get("/api/transactions/ch_1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value("ch_1"));
    }

    @Test
    void testCreateCharge() throws Exception {
        PaymentChargeRequest req = new PaymentChargeRequest(new BigDecimal("150.00"), "Hoang Phat", "hp@example.com", "Visa", "Payment 1");
        Transaction tx = new Transaction("ch_2", "$150.00 USD", "$150.00 USD", "-$4.65 USD", "$145.35 USD", "Succeeded", "success", "Hoang Phat", "hp@example.com", "Visa", "Nov 01, 2026", new BigDecimal("150.00"), "Payment 1");

        when(transactionService.createCharge(any(PaymentChargeRequest.class))).thenReturn(tx);

        mockMvc.perform(post("/api/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.gross").value("$150.00 USD"));
    }

    @Test
    void testRefundTransaction() throws Exception {
        Transaction tx = new Transaction("ch_1", "$100.00 USD", "$100.00 USD", "$0.00 USD", "$0.00 USD", "Refunded", "neutral", "Hoang Phat", "hp@example.com", "Visa", "Nov 01, 2026", new BigDecimal("100.00"), "Debt settlement");
        when(transactionService.refundTransaction("ch_1")).thenReturn(tx);

        mockMvc.perform(post("/api/transactions/ch_1/refund"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("Refunded"));
    }

    @Test
    void testExportCsv() throws Exception {
        when(transactionService.exportCsv()).thenReturn("col1,col2\nval1,val2".getBytes());

        mockMvc.perform(get("/api/transactions/export/csv"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", "attachment; filename=\"cactus_transactions.csv\""));
    }

    @Test
    void testExportJson() throws Exception {
        when(transactionService.exportJson()).thenReturn("[{\"id\":\"ch_1\"}]");

        mockMvc.perform(get("/api/transactions/export/json"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", "attachment; filename=\"cactus_transactions.json\""))
                .andExpect(content().string("[{\"id\":\"ch_1\"}]"));
    }

    @Test
    void testFilterTransactions() throws Exception {
        Transaction tx = new Transaction("ch_1", "$100.00 USD", "$100.00 USD", "-$3.20 USD", "$96.80 USD", "Succeeded", "success", "Hoang Phat", "hp@example.com", "Visa", "Nov 01, 2026", new BigDecimal("100.00"), "Debt settlement");
        com.cactus.practice.dto.PagedResponse<Transaction> paged = new com.cactus.practice.dto.PagedResponse<>(java.util.List.of(tx), 0, 10, 1L, 1, true);

        when(transactionService.filterTransactions(any(), eq(0), eq(10), any(), any())).thenReturn(paged);

        mockMvc.perform(get("/api/transactions/filter"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalElements").value(1));
    }
}
