package com.cactus.practice.rest;

import com.cactus.practice.dto.O2CDtos.*;
import com.cactus.practice.service.O2CWorkflowService;
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

import java.util.Collections;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class O2CWorkflowControllerTest {

    private MockMvc mockMvc;

    @Mock
    private O2CWorkflowService o2cService;

    @InjectMocks
    private O2CWorkflowController controller;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void testGetKpis() throws Exception {
        O2CKpisDto kpis = O2CKpisDto.builder().dsoDays("40 ngày").ceiPercent("90%").build();
        when(o2cService.getKpis()).thenReturn(kpis);

        mockMvc.perform(get("/api/o2c/kpis"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testGetOrders() throws Exception {
        when(o2cService.getSalesOrders()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/o2c/orders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testApproveOrder_Success() throws Exception {
        SalesOrderDto order = SalesOrderDto.builder().id("SO-1").approvalStatus("APPROVED").build();
        when(o2cService.approveOrderCredit(eq("SO-1"), any())).thenReturn(order);

        mockMvc.perform(post("/api/o2c/orders/SO-1/approve")
                        .header("X-User-Role", "ROLE_ADMIN"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testApproveOrder_Forbidden() throws Exception {
        mockMvc.perform(post("/api/o2c/orders/SO-1/approve")
                        .header("X-User-Role", "ROLE_USER"))
                .andExpect(status().isForbidden());
    }

    @Test
    void testApproveOrder_NotFound() throws Exception {
        when(o2cService.approveOrderCredit(eq("SO-999"), any())).thenReturn(null);

        mockMvc.perform(post("/api/o2c/orders/SO-999/approve")
                        .header("X-User-Role", "ROLE_ADMIN"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testGetInvoices() throws Exception {
        when(o2cService.getInvoices()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/o2c/invoices"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testPayInvoice_Success() throws Exception {
        InvoiceDto inv = InvoiceDto.builder().id("INV-1").paymentStatus("PAID").build();
        when(o2cService.payInvoice("INV-1", "Full")).thenReturn(inv);

        mockMvc.perform(post("/api/o2c/invoices/INV-1/pay")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("amount", "Full"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testPayInvoice_NotFound() throws Exception {
        when(o2cService.payInvoice("INV-999", "Full")).thenReturn(null);

        mockMvc.perform(post("/api/o2c/invoices/INV-999/pay"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testGetDunningWorklist_Success() throws Exception {
        when(o2cService.getDunningWorklist()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/o2c/dunning")
                        .header("X-User-Role", "ROLE_STAFF"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testGetDunningWorklist_Forbidden() throws Exception {
        mockMvc.perform(get("/api/o2c/dunning")
                        .header("X-User-Role", "ROLE_USER"))
                .andExpect(status().isForbidden());
    }

    @Test
    void testSendDunningNotice_Success() throws Exception {
        DunningItemDto item = DunningItemDto.builder().id("DUN-1").status("SENT").build();
        when(o2cService.sendDunningReminder("DUN-1")).thenReturn(item);

        mockMvc.perform(post("/api/o2c/dunning/DUN-1/send")
                        .header("X-User-Role", "ROLE_ADMIN"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testSendDunningNotice_Forbidden() throws Exception {
        mockMvc.perform(post("/api/o2c/dunning/DUN-1/send")
                        .header("X-User-Role", "ROLE_USER"))
                .andExpect(status().isForbidden());
    }

    @Test
    void testSendDunningNotice_NotFound() throws Exception {
        when(o2cService.sendDunningReminder("DUN-999")).thenReturn(null);

        mockMvc.perform(post("/api/o2c/dunning/DUN-999/send")
                        .header("X-User-Role", "ROLE_ADMIN"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testGetPtpDisputes() throws Exception {
        when(o2cService.getPtpDisputes()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/o2c/ptp-disputes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testCreatePtp() throws Exception {
        PtpDisputeDto dto = PtpDisputeDto.builder().id("PTP-1").build();
        when(o2cService.createPtp(any())).thenReturn(dto);

        mockMvc.perform(post("/api/o2c/ptp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testResolveDispute_Success() throws Exception {
        PtpDisputeDto dto = PtpDisputeDto.builder().id("DIS-1").status("RESOLVED").build();
        when(o2cService.resolveDispute(eq("DIS-1"), any())).thenReturn(dto);

        mockMvc.perform(post("/api/o2c/disputes/DIS-1/resolve")
                        .header("X-User-Role", "ROLE_ADMIN")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("resolution", "Agreed"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testResolveDispute_Forbidden() throws Exception {
        mockMvc.perform(post("/api/o2c/disputes/DIS-1/resolve")
                        .header("X-User-Role", "ROLE_USER")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void testResolveDispute_NotFound() throws Exception {
        when(o2cService.resolveDispute(eq("DIS-999"), any())).thenReturn(null);

        mockMvc.perform(post("/api/o2c/disputes/DIS-999/resolve")
                        .header("X-User-Role", "ROLE_ADMIN")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testGetReconciliation_Success() throws Exception {
        when(o2cService.getReconciliationFeeds()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/o2c/reconciliation")
                        .header("X-User-Role", "ROLE_ADMIN"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testGetReconciliation_Forbidden() throws Exception {
        mockMvc.perform(get("/api/o2c/reconciliation")
                        .header("X-User-Role", "ROLE_USER"))
                .andExpect(status().isForbidden());
    }

    @Test
    void testApplyDeMinimis_Success() throws Exception {
        BankReconciliationDto dto = BankReconciliationDto.builder().txId("TX-1").build();
        when(o2cService.applyDeMinimis("TX-1")).thenReturn(dto);

        mockMvc.perform(post("/api/o2c/reconciliation/TX-1/de-minimis")
                        .header("X-User-Role", "ROLE_ADMIN"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testApplyDeMinimis_Forbidden() throws Exception {
        mockMvc.perform(post("/api/o2c/reconciliation/TX-1/de-minimis")
                        .header("X-User-Role", "ROLE_STAFF"))
                .andExpect(status().isForbidden());
    }

    @Test
    void testApplyDeMinimis_NotFound() throws Exception {
        when(o2cService.applyDeMinimis("TX-999")).thenReturn(null);

        mockMvc.perform(post("/api/o2c/reconciliation/TX-999/de-minimis")
                        .header("X-User-Role", "ROLE_ADMIN"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testGetMakerChecker_Success() throws Exception {
        when(o2cService.getMakerCheckerRequests()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/o2c/maker-checker")
                        .header("X-User-Role", "ROLE_ADMIN"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testGetMakerChecker_Forbidden() throws Exception {
        mockMvc.perform(get("/api/o2c/maker-checker")
                        .header("X-User-Role", "GUEST"))
                .andExpect(status().isForbidden());
    }

    @Test
    void testProcessMakerChecker_Success() throws Exception {
        MakerCheckerDto dto = MakerCheckerDto.builder().id("MC-1").status("APPROVED").build();
        when(o2cService.processMakerChecker(eq("MC-1"), eq(true), any())).thenReturn(dto);

        mockMvc.perform(post("/api/o2c/maker-checker/MC-1/process")
                        .header("X-User-Role", "ROLE_ADMIN")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("approved", true, "checker", "Admin"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testProcessMakerChecker_Forbidden() throws Exception {
        mockMvc.perform(post("/api/o2c/maker-checker/MC-1/process")
                        .header("X-User-Role", "ROLE_STAFF")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("role", "ROLE_STAFF"))))
                .andExpect(status().isForbidden());
    }

    @Test
    void testProcessMakerChecker_NotFound() throws Exception {
        when(o2cService.processMakerChecker(eq("MC-999"), eq(true), any())).thenReturn(null);

        mockMvc.perform(post("/api/o2c/maker-checker/MC-999/process")
                        .header("X-User-Role", "ROLE_ADMIN")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }
}
