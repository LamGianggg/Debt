package com.cactus.practice.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payouts")
public class Payout {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false)
    private String amount; // formatted e.g. "$18,250.00 USD"

    @Column(precision = 12, scale = 2)
    private BigDecimal rawAmount;

    @Column(nullable = false)
    private String status; // "Paid", "In Transit", "Canceled"

    private String statusType; // "success", "pending", "neutral"
    private String destination; // "Chase Bank •••• 8841"
    private String initiated;
    private String arrival;
    private String type; // "Standard Automated", "Instant Payout"

    private LocalDateTime createdAt;

    public Payout() {
        this.createdAt = LocalDateTime.now();
    }

    public Payout(String id, String amount, BigDecimal rawAmount, String status, String statusType,
                  String destination, String initiated, String arrival, String type) {
        this.id = id;
        this.amount = amount;
        this.rawAmount = rawAmount;
        this.status = status;
        this.statusType = statusType;
        this.destination = destination;
        this.initiated = initiated;
        this.arrival = arrival;
        this.type = type;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getAmount() { return amount; }
    public void setAmount(String amount) { this.amount = amount; }

    public BigDecimal getRawAmount() { return rawAmount; }
    public void setRawAmount(BigDecimal rawAmount) { this.rawAmount = rawAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getStatusType() { return statusType; }
    public void setStatusType(String statusType) { this.statusType = statusType; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public String getInitiated() { return initiated; }
    public void setInitiated(String initiated) { this.initiated = initiated; }

    public String getArrival() { return arrival; }
    public void setArrival(String arrival) { this.arrival = arrival; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
