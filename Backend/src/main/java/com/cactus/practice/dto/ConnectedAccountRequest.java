package com.cactus.practice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class ConnectedAccountRequest {
    @NotBlank(message = "Clinic name is required")
    private String name;

    private String type;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    private String location;
    private String payoutBank;

    public ConnectedAccountRequest() {}

    public ConnectedAccountRequest(String name, String type, String email, String location, String payoutBank) {
        this.name = name;
        this.type = type;
        this.email = email;
        this.location = location;
        this.payoutBank = payoutBank;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getPayoutBank() { return payoutBank; }
    public void setPayoutBank(String payoutBank) { this.payoutBank = payoutBank; }
}
