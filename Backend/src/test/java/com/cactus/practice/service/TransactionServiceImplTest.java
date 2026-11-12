package com.cactus.practice.service;

import com.cactus.practice.HibernateDao.TransactionHibernateDao;
import com.cactus.practice.dto.PagedResponse;
import com.cactus.practice.dto.PaymentChargeRequest;
import com.cactus.practice.entity.Customer;
import com.cactus.practice.entity.Transaction;
import com.cactus.practice.exception.BusinessException;
import com.cactus.practice.exception.ResourceNotFoundException;
import com.cactus.practice.repository.CustomerRepository;
import com.cactus.practice.repository.TransactionRepository;
import com.cactus.practice.service.impl.TransactionServiceImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceImplTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private TransactionHibernateDao transactionHibernateDao;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private TransactionServiceImpl transactionService;

    @Test
    void testGetAllTransactions() {
        Transaction tx = new Transaction("ch_1", "$100.00 USD", "$100.00 USD", "-$3.20 USD", "$96.80 USD", "Succeeded", "success", "Hoang Phat", "hp@example.com", "Visa", "Nov 01, 2026", new BigDecimal("100.00"), "Debt settlement");
        when(transactionRepository.findAllByOrderByCreatedAtDesc()).thenReturn(Collections.singletonList(tx));

        List<Transaction> list = transactionService.getAllTransactions();
        assertEquals(1, list.size());
        assertEquals("ch_1", list.get(0).getId());
    }

    @Test
    void testGetTransactionById_Found() {
        Transaction tx = new Transaction("ch_1", "$100.00 USD", "$100.00 USD", "-$3.20 USD", "$96.80 USD", "Succeeded", "success", "Hoang Phat", "hp@example.com", "Visa", "Nov 01, 2026", new BigDecimal("100.00"), "Debt settlement");
        when(transactionRepository.findById("ch_1")).thenReturn(Optional.of(tx));

        Transaction result = transactionService.getTransactionById("ch_1");
        assertNotNull(result);
        assertEquals("ch_1", result.getId());
    }

    @Test
    void testGetTransactionById_NotFound() {
        when(transactionRepository.findById("ch_999")).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> transactionService.getTransactionById("ch_999"));
    }

    @Test
    void testCreateCharge_WithCustomerUpdate() {
        PaymentChargeRequest req = new PaymentChargeRequest(new BigDecimal("200.00"), "Hoang Phat", "hp@example.com", "Visa •••• 4242", "Installment payment #1");

        Customer cust = new Customer("cus_1", "Hoang Phat", "hp@example.com", "0901234567", "$500.00 USD", "$0.00 USD", 2, "Nov 01, 2026", "Active", "Ha Noi", "Visa");
        when(customerRepository.findByNameIgnoreCase("Hoang Phat")).thenReturn(Optional.of(cust));
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Transaction created = transactionService.createCharge(req);
        assertNotNull(created);
        assertEquals("Succeeded", created.getStatus());
        assertEquals(new BigDecimal("200.00"), created.getRawAmount());
        verify(customerRepository, times(1)).save(cust);
        assertEquals(3, cust.getPaymentsCount());
    }

    @Test
    void testRefundTransaction_Success() {
        Transaction tx = new Transaction("ch_1", "$100.00 USD", "$100.00 USD", "-$3.20 USD", "$96.80 USD", "Succeeded", "success", "Hoang Phat", "hp@example.com", "Visa", "Nov 01, 2026", new BigDecimal("100.00"), "Debt settlement");
        when(transactionRepository.findById("ch_1")).thenReturn(Optional.of(tx));

        Customer cust = new Customer("cus_1", "Hoang Phat", "hp@example.com", "0901234567", "$500.00 USD", "$0.00 USD", 2, "Nov 01, 2026", "Active", "Ha Noi", "Visa");
        when(customerRepository.findByNameIgnoreCase("Hoang Phat")).thenReturn(Optional.of(cust));
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Transaction refunded = transactionService.refundTransaction("ch_1");
        assertEquals("Refunded", refunded.getStatus());
        assertEquals("$0.00 USD", refunded.getNet());
        verify(customerRepository, times(1)).save(cust);
    }

    @Test
    void testRefundTransaction_AlreadyRefunded() {
        Transaction tx = new Transaction("ch_1", "$100.00 USD", "$100.00 USD", "$0.00 USD", "$0.00 USD", "Refunded", "neutral", "Hoang Phat", "hp@example.com", "Visa", "Nov 01, 2026", new BigDecimal("100.00"), "Debt settlement");
        when(transactionRepository.findById("ch_1")).thenReturn(Optional.of(tx));

        assertThrows(BusinessException.class, () -> transactionService.refundTransaction("ch_1"));
    }

    @Test
    void testFilterTransactions() {
        Transaction tx = new Transaction("ch_1", "$100.00 USD", "$100.00 USD", "-$3.20 USD", "$96.80 USD", "Succeeded", "success", "Hoang Phat", "hp@example.com", "Visa", "Nov 01, 2026", new BigDecimal("100.00"), "Debt settlement");
        Page<Transaction> page = new PageImpl<>(Collections.singletonList(tx), PageRequest.of(0, 10), 1);
        when(transactionHibernateDao.filter("Hoang", 0, 10, "createdAt", "desc")).thenReturn(page);

        PagedResponse<Transaction> result = transactionService.filterTransactions("Hoang", 0, 10, "createdAt", "desc");
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
    }

    @Test
    void testExportCsv() {
        Transaction tx = new Transaction("ch_1", "$100.00 USD", "$100.00 USD", "-$3.20 USD", "$96.80 USD", "Succeeded", "success", "Hoang Phat", "hp@example.com", "Visa", "Nov 01, 2026", new BigDecimal("100.00"), "Debt settlement");
        when(transactionRepository.findAllByOrderByCreatedAtDesc()).thenReturn(Collections.singletonList(tx));

        byte[] csv = transactionService.exportCsv();
        assertNotNull(csv);
        assertTrue(new String(csv).contains("Hoang Phat"));
    }

    @Test
    void testExportCsv_SanitizesFormulaInjection() {
        Transaction tx = new Transaction("ch_2", "$100.00 USD", "$100.00 USD", "$0.00 USD", "$100.00 USD", "Succeeded", "success", "=CMD|' /C calc'!A0", "hp@example.com", "Visa", "Nov 01, 2026", new BigDecimal("100.00"), "@sum(1,2)");
        when(transactionRepository.findAllByOrderByCreatedAtDesc()).thenReturn(Collections.singletonList(tx));

        byte[] csv = transactionService.exportCsv();
        String content = new String(csv);
        assertTrue(content.contains("\"'=CMD|' /C calc'!A0\""));
        assertTrue(content.contains("\"'@sum(1,2)\""));
    }
}
