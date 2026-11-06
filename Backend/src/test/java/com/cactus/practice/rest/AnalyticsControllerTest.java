package com.cactus.practice.rest;

import com.cactus.practice.dto.OverviewMetricsDto;
import com.cactus.practice.dto.ReportsDto;
import com.cactus.practice.exception.GlobalExceptionHandler;
import com.cactus.practice.service.AnalyticsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class AnalyticsControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AnalyticsService analyticsService;

    @InjectMocks
    private AnalyticsController controller;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void testGetOverview() throws Exception {
        OverviewMetricsDto dto = new OverviewMetricsDto();
        dto.setTotalVolume("$128,490.00");
        dto.setNetRevenue("$96,210.00");
        when(analyticsService.getOverview("30d")).thenReturn(dto);

        mockMvc.perform(get("/api/analytics/overview").param("timeframe", "30d"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalVolume").value("$128,490.00"));
    }

    @Test
    void testGetReports() throws Exception {
        ReportsDto dto = new ReportsDto();
        dto.setMrr("$14,290.00");
        dto.setAov("$68.40");
        when(analyticsService.getReports()).thenReturn(dto);

        mockMvc.perform(get("/api/analytics/reports"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.mrr").value("$14,290.00"));
    }
}
