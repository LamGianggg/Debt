package com.cactus.practice.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "connected_accounts")
public class ConnectedAccount {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false)
    private String name;

    private String type; // "Custom Clinic", "Express Partner", "Standard Clinic"

    @Column(nullable = false)
    private String email;

    private int patients = 0;
    private String grossVolume = "$0.00 USD";
    private String status = "Enabled"; // "Enabled", "Needs Info", "Restricted"
    private String statusType = "success";
    private String location;
    private String payoutBank;

    public ConnectedAccount() {}

    public ConnectedAccount(String id, String name, String type, String email, int patients,
                            String grossVolume, String status, String statusType, String location, String payoutBank) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.email = email;
        this.patients = patients;
        this.grossVolume = grossVolume;
        this.status = status;
        this.statusType = statusType;
        this.location = location;
        this.payoutBank = payoutBank;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public int getPatients() { return patients; }
    public void setPatients(int patients) { this.patients = patients; }

    public int getDebtFiles() { return patients; }
    public void setDebtFiles(int debtFiles) { this.patients = debtFiles; }

    public String getGrossVolume() { return grossVolume; }
    public void setGrossVolume(String grossVolume) { this.grossVolume = grossVolume; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getStatusType() { return statusType; }
    public void setStatusType(String statusType) { this.statusType = statusType; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getPayoutBank() { return payoutBank; }
    public void setPayoutBank(String payoutBank) { this.payoutBank = payoutBank; }
}
