package com.cactus.practice.dto;

public class ReportsDto {
    private String mrr;               // Monthly Recurring Revenue
    private String aov;               // Average Order Value
    private String refundRate;        // e.g. "0.8%"
    private String totalFees;         // e.g. "$3,420.00"
    private int totalTransactions;
    private int successfulCharges;
    private int refundedCharges;

    public ReportsDto() {}

    public String getMrr() { return mrr; }
    public void setMrr(String mrr) { this.mrr = mrr; }

    public String getAov() { return aov; }
    public void setAov(String aov) { this.aov = aov; }

    public String getRefundRate() { return refundRate; }
    public void setRefundRate(String refundRate) { this.refundRate = refundRate; }

    public String getTotalFees() { return totalFees; }
    public void setTotalFees(String totalFees) { this.totalFees = totalFees; }

    public int getTotalTransactions() { return totalTransactions; }
    public void setTotalTransactions(int totalTransactions) { this.totalTransactions = totalTransactions; }

    public int getSuccessfulCharges() { return successfulCharges; }
    public void setSuccessfulCharges(int successfulCharges) { this.successfulCharges = successfulCharges; }

    public int getRefundedCharges() { return refundedCharges; }
    public void setRefundedCharges(int refundedCharges) { this.refundedCharges = refundedCharges; }
}
