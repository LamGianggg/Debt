package com.cactus.practice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class CustomerRequest {
    @NotBlank(message = "Customer name is required")
    private String name;

    @NotBlank(message = "Customer email is required")
    @Email(message = "Invalid email format")
    private String email;

    private String phone;
    private String address;
    private String defaultPayment;
    private String status;

    public CustomerRequest() {}

    public CustomerRequest(String name, String email, String phone, String address, String status, String defaultPayment) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.status = status;
        this.defaultPayment = defaultPayment;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getDefaultPayment() { return defaultPayment; }
    public void setDefaultPayment(String defaultPayment) { this.defaultPayment = defaultPayment; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
