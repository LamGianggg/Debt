package com.cactus.practice.rest;

import com.cactus.practice.dto.BalanceSummaryDto;
import com.cactus.practice.dto.PagedResponse;
import com.cactus.practice.dto.PayoutRequest;
import com.cactus.practice.entity.Payout;
import com.cactus.practice.exception.GlobalExceptionHandler;
import com.cactus.practice.service.PayoutService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class PayoutControllerTest {

    private MockMvc mockMvc;

    @Mock
    private PayoutService payoutService;

    @InjectMocks
    private PayoutController controller;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void testGetAllPayouts() throws Exception {
        Payout po = new Payout("po_1", "$5K", new BigDecimal("5000"), "Paid", "success", "VCB", "Nov 01", "Nov 02", "Standard");
        when(payoutService.getAllPayouts()).thenReturn(List.of(po));

        mockMvc.perform(get("/api/payouts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].id").value("po_1"));
    }

    @Test
    void testGetBalanceSummary() throws Exception {
        BalanceSummaryDto summary = new BalanceSummaryDto("$100", "$50", "$200", 100.0, 50.0);
        when(payoutService.getBalanceSummary()).thenReturn(summary);

        mockMvc.perform(get("/api/payouts/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.available").value("$100"));
    }

    @Test
    void testCreatePayout() throws Exception {
        PayoutRequest req = new PayoutRequest(new BigDecimal("100.00"), "Instant", "VCB");
        Payout po = new Payout("po_1", "$100", new BigDecimal("100"), "Paid", "success", "VCB", "Nov 01", "Nov 02", "Instant");

        when(payoutService.createPayout(any(PayoutRequest.class))).thenReturn(po);

        mockMvc.perform(post("/api/payouts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value("po_1"));
    }

    @Test
    void testFilterPayouts() throws Exception {
        Payout po = new Payout("po_1", "$5K", new BigDecimal("5000"), "Paid", "success", "VCB", "Nov 01", "Nov 02", "Standard");
        PagedResponse<Payout> paged = new PagedResponse<>(List.of(po), 0, 10, 1L, 1, true);

        when(payoutService.filterPayouts(any(), eq(0), eq(10), any(), any())).thenReturn(paged);

        mockMvc.perform(get("/api/payouts/filter"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalElements").value(1));
    }
}
