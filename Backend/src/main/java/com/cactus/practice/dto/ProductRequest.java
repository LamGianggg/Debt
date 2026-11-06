package com.cactus.practice.dto;

import jakarta.validation.constraints.NotBlank;

public class ProductRequest {
    @NotBlank(message = "Product name is required")
    private String name;

    private String description;

    @NotBlank(message = "Price is required")
    private String price;

    private String billing;

    public ProductRequest() {}

    public ProductRequest(String name, String description, String price, String billing) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.billing = billing;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPrice() { return price; }
    public void setPrice(String price) { this.price = price; }

    public String getBilling() { return billing; }
    public void setBilling(String billing) { this.billing = billing; }
}
