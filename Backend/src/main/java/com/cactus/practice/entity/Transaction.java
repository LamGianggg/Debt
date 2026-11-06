package com.cactus.practice.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false)
    private String amount; // formatted e.g. "$9.93 USD"

    @Column(nullable = false)
    private String gross; // formatted e.g. "$9.93 USD"

    private String fee;   // formatted e.g. "-$0.59 USD"
    private String net;   // formatted e.g. "$9.34 USD"

    @Column(nullable = false)
    private String status; // "Succeeded", "Refunded", "Failed"

    private String statusType; // "success", "neutral", "error"

    @Column(nullable = false)
    private String customer;

    private String customerEmail;
    private String method; // "Visa •••• 4242"
    private String date;   // formatted display date

    @Column(precision = 10, scale = 2)
    private BigDecimal rawAmount;

    @Column(length = 500)
    private String description;

    private LocalDateTime createdAt;

    public Transaction() {
        this.createdAt = LocalDateTime.now();
    }

    public Transaction(String id, String amount, String gross, String fee, String net,
                       String status, String statusType, String customer, String customerEmail,
                       String method, String date, BigDecimal rawAmount, String description) {
        this.id = id;
        this.amount = amount;
        this.gross = gross;
        this.fee = fee;
        this.net = net;
        this.status = status;
        this.statusType = statusType;
        this.customer = customer;
        this.customerEmail = customerEmail;
        this.method = method;
        this.date = date;
        this.rawAmount = rawAmount;
        this.description = description;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getAmount() { return amount; }
    public void setAmount(String amount) { this.amount = amount; }

    public String getGross() { return gross; }
    public void setGross(String gross) { this.gross = gross; }

    public String getFee() { return fee; }
    public void setFee(String fee) { this.fee = fee; }

    public String getNet() { return net; }
    public void setNet(String net) { this.net = net; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getStatusType() { return statusType; }
    public void setStatusType(String statusType) { this.statusType = statusType; }

    public String getCustomer() { return customer; }
    public void setCustomer(String customer) { this.customer = customer; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getMethod() { return method; }
    public void setMethod(String method) { this.method = method; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public BigDecimal getRawAmount() { return rawAmount; }
    public void setRawAmount(BigDecimal rawAmount) { this.rawAmount = rawAmount; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
