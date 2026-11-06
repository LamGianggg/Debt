package com.cactus.practice.service;

import com.cactus.practice.dto.OverviewMetricsDto;
import com.cactus.practice.dto.ReportsDto;

public interface AnalyticsService {
    OverviewMetricsDto getOverview(String timeframe);
    ReportsDto getReports();
}
