package com.cactus.practice.dto;

import java.math.BigDecimal;

public class OverviewMetricsDto {
    private String totalVolume;
    private String netRevenue;
    private int activeSubscriptions;
    private int totalCustomers;
    private String volumeGrowth;
    private String timeframe;

    private BigDecimal rawTotalVolume;
    private BigDecimal rawNetRevenue;

    public OverviewMetricsDto() {}

    public String getTotalVolume() { return totalVolume; }
    public void setTotalVolume(String totalVolume) { this.totalVolume = totalVolume; }

    public String getNetRevenue() { return netRevenue; }
    public void setNetRevenue(String netRevenue) { this.netRevenue = netRevenue; }

    public int getActiveSubscriptions() { return activeSubscriptions; }
    public void setActiveSubscriptions(int activeSubscriptions) { this.activeSubscriptions = activeSubscriptions; }

    public int getTotalCustomers() { return totalCustomers; }
    public void setTotalCustomers(int totalCustomers) { this.totalCustomers = totalCustomers; }

    public String getVolumeGrowth() { return volumeGrowth; }
    public void setVolumeGrowth(String volumeGrowth) { this.volumeGrowth = volumeGrowth; }

    public String getTimeframe() { return timeframe; }
    public void setTimeframe(String timeframe) { this.timeframe = timeframe; }

    public BigDecimal getRawTotalVolume() { return rawTotalVolume; }
    public void setRawTotalVolume(BigDecimal rawTotalVolume) { this.rawTotalVolume = rawTotalVolume; }

    public BigDecimal getRawNetRevenue() { return rawNetRevenue; }
    public void setRawNetRevenue(BigDecimal rawNetRevenue) { this.rawNetRevenue = rawNetRevenue; }
}
