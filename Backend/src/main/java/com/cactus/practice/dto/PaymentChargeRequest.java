package com.cactus.practice.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class PaymentChargeRequest {
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.50", message = "Minimum charge amount is $0.50")
    private BigDecimal amount;

    private String customerId;

    @NotBlank(message = "Customer name is required")
    private String customerName;

    private String customerEmail;

    private String description;

    private String method;

    public PaymentChargeRequest() {}

    public PaymentChargeRequest(BigDecimal amount, String customerName, String customerEmail, String method, String description) {
        this.amount = amount;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.method = method;
        this.description = description;
    }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getMethod() { return method; }
    public void setMethod(String method) { this.method = method; }
}
