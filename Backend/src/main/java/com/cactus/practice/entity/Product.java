package com.cactus.practice.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String price; // "$49.00 USD"

    private String billing; // "One-time", "Recurring (Monthly)", "Recurring (Yearly)"
    private int activeSubscribers = 0;
    private String status = "Active";
    private String created;

    public Product() {}

    public Product(String id, String name, String description, String price, String billing,
                   int activeSubscribers, String status, String created) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.billing = billing;
        this.activeSubscribers = activeSubscribers;
        this.status = status;
        this.created = created;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPrice() { return price; }
    public void setPrice(String price) { this.price = price; }

    public String getBilling() { return billing; }
    public void setBilling(String billing) { this.billing = billing; }

    public int getActiveSubscribers() { return activeSubscribers; }
    public void setActiveSubscribers(int activeSubscribers) { this.activeSubscribers = activeSubscribers; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCreated() { return created; }
    public void setCreated(String created) { this.created = created; }
}
