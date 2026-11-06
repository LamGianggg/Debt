package com.cactus.practice.rest;

import com.cactus.practice.dto.ApiResponse;
import com.cactus.practice.dto.OverviewMetricsDto;
import com.cactus.practice.dto.ReportsDto;
import com.cactus.practice.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@Tag(name = "Analytics & Reports", description = "Endpoints for financial metrics, MRR, AOV, refund rate, and volume summaries")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @Autowired
    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/overview")
    @Operation(summary = "Get overview KPIs (gross volume, net volume, subscriptions, customers, growth)")
    public ResponseEntity<ApiResponse<OverviewMetricsDto>> getOverview(
            @RequestParam(defaultValue = "30d") String timeframe
    ) {
        OverviewMetricsDto metrics = analyticsService.getOverview(timeframe);
        return ResponseEntity.ok(ApiResponse.ok("Overview metrics retrieved successfully", metrics));
    }

    @GetMapping("/reports")
    @Operation(summary = "Get detailed reports metrics (MRR, AOV, refund rate, fee deductions)")
    public ResponseEntity<ApiResponse<ReportsDto>> getReports() {
        ReportsDto reports = analyticsService.getReports();
        return ResponseEntity.ok(ApiResponse.ok("Reports retrieved successfully", reports));
    }
}
