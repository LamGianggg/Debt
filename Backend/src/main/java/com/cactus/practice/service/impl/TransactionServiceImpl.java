package com.cactus.practice.service.impl;

import com.cactus.practice.HibernateDao.TransactionHibernateDao;
import com.cactus.practice.dto.PagedResponse;
import com.cactus.practice.dto.PaymentChargeRequest;
import com.cactus.practice.entity.Customer;
import com.cactus.practice.entity.Transaction;
import com.cactus.practice.exception.BusinessException;
import com.cactus.practice.exception.ResourceNotFoundException;
import com.cactus.practice.repository.CustomerRepository;
import com.cactus.practice.repository.TransactionRepository;
import com.cactus.practice.service.TransactionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final CustomerRepository customerRepository;
    private final TransactionHibernateDao transactionHibernateDao;
    private final ObjectMapper objectMapper;

    @Autowired
    public TransactionServiceImpl(TransactionRepository transactionRepository,
                                  CustomerRepository customerRepository,
                                  TransactionHibernateDao transactionHibernateDao,
                                  ObjectMapper objectMapper) {
        this.transactionRepository = transactionRepository;
        this.customerRepository = customerRepository;
        this.transactionHibernateDao = transactionHibernateDao;
        this.objectMapper = objectMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    @Transactional(readOnly = true)
    public Transaction getTransactionById(String id) {
        return transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));
    }

    @Override
    public Transaction createCharge(PaymentChargeRequest request) {
        BigDecimal amount = request.getAmount().setScale(2, RoundingMode.HALF_UP);
        // Stripe fee formula: 2.9% + $0.30
        BigDecimal fee = amount.multiply(new BigDecimal("0.029")).add(new BigDecimal("0.30")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal net = amount.subtract(fee).setScale(2, RoundingMode.HALF_UP);

        String txId = "ch_3N" + UUID.randomUUID().toString().replace("-", "").substring(0, 10);
        String formattedDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMM dd, yyyy, hh:mm:ss a"));

        String email = request.getCustomerEmail();
        if (email == null || email.trim().isEmpty()) {
            email = request.getCustomerName().toLowerCase().replaceAll("\\s+", ".") + "@example.com";
        }

        Transaction tx = new Transaction(
                txId,
                String.format("$%.2f USD", amount.doubleValue()),
                String.format("$%.2f USD", amount.doubleValue()),
                String.format("-$%.2f USD", fee.doubleValue()),
                String.format("$%.2f USD", net.doubleValue()),
                "Succeeded",
                "success",
                request.getCustomerName(),
                email,
                request.getMethod() != null ? request.getMethod() : "Visa •••• 4242",
                formattedDate,
                amount,
                request.getDescription() != null ? request.getDescription() : "Medical Care Consultation"
        );

        // Update customer metrics if present
        Optional<Customer> customerOpt = customerRepository.findByNameIgnoreCase(request.getCustomerName());
        if (customerOpt.isPresent()) {
            Customer cust = customerOpt.get();
            cust.setPaymentsCount(cust.getPaymentsCount() + 1);
            // parse existing totalSpent
            double currentSpent = parseCurrency(cust.getTotalSpent());
            cust.setTotalSpent(String.format("$%.2f USD", currentSpent + amount.doubleValue()));
            customerRepository.save(cust);
        }

        return transactionRepository.save(tx);
    }

    @Override
    public Transaction refundTransaction(String id) {
        Transaction tx = getTransactionById(id);
        if ("Refunded".equalsIgnoreCase(tx.getStatus())) {
            throw new BusinessException("Transaction is already refunded");
        }

        tx.setStatus("Refunded");
        tx.setStatusType("neutral");
        tx.setFee("$0.00 USD");
        tx.setNet("$0.00 USD");

        // Update customer totalSpent
        Optional<Customer> customerOpt = customerRepository.findByNameIgnoreCase(tx.getCustomer());
        if (customerOpt.isPresent() && tx.getRawAmount() != null) {
            Customer cust = customerOpt.get();
            double currentSpent = parseCurrency(cust.getTotalSpent());
            double updatedSpent = Math.max(0.0, currentSpent - tx.getRawAmount().doubleValue());
            cust.setTotalSpent(String.format("$%.2f USD", updatedSpent));
            customerRepository.save(cust);
        }

        return transactionRepository.save(tx);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<Transaction> filterTransactions(String search, int page, int size, String sortBy, String sortDir) {
        Page<Transaction> pagedResult = transactionHibernateDao.filter(search, page, size, sortBy, sortDir);
        return new PagedResponse<>(
                pagedResult.getContent(),
                pagedResult.getNumber(),
                pagedResult.getSize(),
                pagedResult.getTotalElements(),
                pagedResult.getTotalPages(),
                pagedResult.isLast()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] exportCsv() {
        List<Transaction> list = transactionRepository.findAllByOrderByCreatedAtDesc();
        StringBuilder sb = new StringBuilder();
        sb.append("Transaction ID,Customer,Email,Gross,Fee,Net,Status,Method,Date,Description\n");
        for (Transaction t : list) {
            sb.append(escapeCsv(t.getId())).append(",")
              .append(escapeCsv(t.getCustomer())).append(",")
              .append(escapeCsv(t.getCustomerEmail())).append(",")
              .append(escapeCsv(t.getGross())).append(",")
              .append(escapeCsv(t.getFee())).append(",")
              .append(escapeCsv(t.getNet())).append(",")
              .append(escapeCsv(t.getStatus())).append(",")
              .append(escapeCsv(t.getMethod())).append(",")
              .append(escapeCsv(t.getDate())).append(",")
              .append(escapeCsv(t.getDescription())).append("\n");
        }
        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    @Override
    @Transactional(readOnly = true)
    public String exportJson() {
        List<Transaction> list = transactionRepository.findAllByOrderByCreatedAtDesc();
        try {
            return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(list);
        } catch (Exception e) {
            throw new BusinessException("Failed to serialize transactions to JSON: " + e.getMessage());
        }
    }

    private double parseCurrency(String formatted) {
        if (formatted == null) return 0.0;
        try {
            String clean = formatted.replaceAll("[^0-9.]", "");
            return Double.parseDouble(clean);
        } catch (Exception e) {
            return 0.0;
        }
    }

    private String escapeCsv(String val) {
        if (val == null) return "\"\"";
        return "\"" + val.replace("\"", "\"\"") + "\"";
    }
}
