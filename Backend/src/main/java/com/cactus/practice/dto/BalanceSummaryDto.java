package com.cactus.practice.dto;

public class BalanceSummaryDto {
    private String available;
    private String inTransit;
    private String totalPayouts;
    private double rawAvailable;
    private double rawInTransit;

    public BalanceSummaryDto() {}

    public BalanceSummaryDto(String available, String inTransit, String totalPayouts, double rawAvailable, double rawInTransit) {
        this.available = available;
        this.inTransit = inTransit;
        this.totalPayouts = totalPayouts;
        this.rawAvailable = rawAvailable;
        this.rawInTransit = rawInTransit;
    }

    public String getAvailable() { return available; }
    public void setAvailable(String available) { this.available = available; }

    public String getInTransit() { return inTransit; }
    public void setInTransit(String inTransit) { this.inTransit = inTransit; }

    public String getTotalPayouts() { return totalPayouts; }
    public void setTotalPayouts(String totalPayouts) { this.totalPayouts = totalPayouts; }

    public double getRawAvailable() { return rawAvailable; }
    public void setRawAvailable(double rawAvailable) { this.rawAvailable = rawAvailable; }

    public double getRawInTransit() { return rawInTransit; }
    public void setRawInTransit(double rawInTransit) { this.rawInTransit = rawInTransit; }
}
