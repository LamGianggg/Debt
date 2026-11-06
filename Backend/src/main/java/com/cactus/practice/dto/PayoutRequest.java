package com.cactus.practice.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class PayoutRequest {
    @NotNull(message = "Payout amount is required")
    @DecimalMin(value = "1.00", message = "Minimum payout amount is $1.00")
    private BigDecimal amount;

    private String destination;
    private String type; // e.g., Instant Payout, Standard Automated

    public PayoutRequest() {}

    public PayoutRequest(BigDecimal amount, String type, String destination) {
        this.amount = amount;
        this.type = type;
        this.destination = destination;
    }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}
