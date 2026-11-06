package com.cactus.practice.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "subscriptions")
public class Subscription {

    @Id
    @Column(length = 64)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    @JsonBackReference
    private Customer customer;

    @Column(nullable = false)
    private String plan;

    @Column(nullable = false)
    private String amount;

    @Column(nullable = false)
    private String status;

    private String renewal;

    public Subscription() {}

    public Subscription(String id, Customer customer, String plan, String amount, String status, String renewal) {
        this.id = id;
        this.customer = customer;
        this.plan = plan;
        this.amount = amount;
        this.status = status;
        this.renewal = renewal;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public String getPlan() { return plan; }
    public void setPlan(String plan) { this.plan = plan; }

    public String getAmount() { return amount; }
    public void setAmount(String amount) { this.amount = amount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRenewal() { return renewal; }
    public void setRenewal(String renewal) { this.renewal = renewal; }
}
