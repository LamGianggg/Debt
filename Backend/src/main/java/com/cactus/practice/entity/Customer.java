package com.cactus.practice.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "customers")
public class Customer {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    private String phone;
    private String balance = "$0.00 USD";
    private String totalSpent = "$0.00 USD";
    private int paymentsCount = 0;
    private String created;
    private String status = "Active";
    private String address;
    private String defaultPayment;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<Subscription> subscriptions = new ArrayList<>();

    public Customer() {}

    public Customer(String id, String name, String email, String phone, String balance,
                    String totalSpent, int paymentsCount, String created, String status,
                    String address, String defaultPayment) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.balance = balance;
        this.totalSpent = totalSpent;
        this.paymentsCount = paymentsCount;
        this.created = created;
        this.status = status;
        this.address = address;
        this.defaultPayment = defaultPayment;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getBalance() { return balance; }
    public void setBalance(String balance) { this.balance = balance; }

    public String getTotalSpent() { return totalSpent; }
    public void setTotalSpent(String totalSpent) { this.totalSpent = totalSpent; }

    public int getPaymentsCount() { return paymentsCount; }
    public void setPaymentsCount(int paymentsCount) { this.paymentsCount = paymentsCount; }

    public String getCreated() { return created; }
    public void setCreated(String created) { this.created = created; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getDefaultPayment() { return defaultPayment; }
    public void setDefaultPayment(String defaultPayment) { this.defaultPayment = defaultPayment; }

    public List<Subscription> getSubscriptions() { return subscriptions; }
    public void setSubscriptions(List<Subscription> subscriptions) { this.subscriptions = subscriptions; }

    public void addSubscription(Subscription subscription) {
        subscriptions.add(subscription);
        subscription.setCustomer(this);
    }
}
