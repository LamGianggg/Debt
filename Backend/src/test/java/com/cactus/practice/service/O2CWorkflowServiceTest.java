package com.cactus.practice.service;

import com.cactus.practice.dto.O2CDtos.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class O2CWorkflowServiceTest {

    private O2CWorkflowService service;

    @BeforeEach
    void setUp() {
        service = new O2CWorkflowService();
    }

    @Test
    void testGetKpis() {
        O2CKpisDto kpis = service.getKpis();
        assertNotNull(kpis);
        assertTrue(kpis.getDsoDays().contains("42.5"));
        assertTrue(kpis.getCeiPercent().contains("88.4%"));
    }

    @Test
    void testGetSalesOrders() {
        List<SalesOrderDto> orders = service.getSalesOrders();
        assertNotNull(orders);
        assertFalse(orders.isEmpty());
    }

    @Test
    void testApproveOrderCredit() {
        SalesOrderDto approved = service.approveOrderCredit("SO-2026-081", "Admin");
        assertNotNull(approved);
        assertEquals("APPROVED", approved.getApprovalStatus());
        assertEquals("PASS", approved.getCreditStatus());

        assertNull(service.approveOrderCredit("NON_EXISTENT", "Admin"));
    }

    @Test
    void testGetInvoices() {
        List<InvoiceDto> invoices = service.getInvoices();
        assertNotNull(invoices);
        assertFalse(invoices.isEmpty());
    }

    @Test
    void testPayInvoice() {
        InvoiceDto paid = service.payInvoice("INV-2026-0091", "450.000.000 ₫");
        assertNotNull(paid);
        assertEquals("PAID", paid.getPaymentStatus());
        assertEquals("0 ₫", paid.getRemainingAmount());

        assertNull(service.payInvoice("NON_EXISTENT", "100 ₫"));
    }

    @Test
    void testGetDunningWorklist() {
        List<DunningItemDto> worklist = service.getDunningWorklist();
        assertNotNull(worklist);
        assertFalse(worklist.isEmpty());
    }

    @Test
    void testSendDunningReminder() {
        DunningItemDto sent = service.sendDunningReminder("DUN-2026-042");
        assertNotNull(sent);
        assertEquals("SENT", sent.getStatus());

        assertNull(service.sendDunningReminder("NON_EXISTENT"));
    }

    @Test
    void testGetPtpDisputes() {
        List<PtpDisputeDto> list = service.getPtpDisputes();
        assertNotNull(list);
        assertFalse(list.isEmpty());
    }

    @Test
    void testCreatePtp() {
        PtpDisputeDto dto = PtpDisputeDto.builder()
                .customerName("Test Customer")
                .amount("10.000.000 ₫")
                .type("PTP")
                .build();
        PtpDisputeDto created = service.createPtp(dto);
        assertNotNull(created);
        assertNotNull(created.getId());
        assertEquals("ACTIVE", created.getStatus());

        // with existing id
        PtpDisputeDto withId = PtpDisputeDto.builder().id("PTP-CUSTOM").build();
        assertEquals("PTP-CUSTOM", service.createPtp(withId).getId());
    }

    @Test
    void testResolveDispute() {
        PtpDisputeDto resolved = service.resolveDispute("DIS-2026-008", "Duyet giam 10%");
        assertNotNull(resolved);
        assertEquals("RESOLVED", resolved.getStatus());

        assertNull(service.resolveDispute("NON_EXISTENT", ""));
    }

    @Test
    void testGetReconciliationFeeds() {
        List<BankReconciliationDto> list = service.getReconciliationFeeds();
        assertNotNull(list);
        assertFalse(list.isEmpty());
    }

    @Test
    void testApplyDeMinimis() {
        BankReconciliationDto applied = service.applyDeMinimis("BNK-TX-9921");
        assertNotNull(applied);
        assertEquals("DE_MINIMIS_WRITTEN_OFF", applied.getStatus());

        assertNull(service.applyDeMinimis("NON_EXISTENT"));
    }

    @Test
    void testGetMakerCheckerRequests() {
        List<MakerCheckerDto> list = service.getMakerCheckerRequests();
        assertNotNull(list);
        assertFalse(list.isEmpty());
    }

    @Test
    void testProcessMakerChecker() {
        MakerCheckerDto approved = service.processMakerChecker("MC-2026-029", true, "Manager");
        assertNotNull(approved);
        assertEquals("APPROVED", approved.getStatus());

        MakerCheckerDto rejected = service.processMakerChecker("MC-2026-028", false, "Manager");
        assertNotNull(rejected);
        assertEquals("REJECTED", rejected.getStatus());

        assertNull(service.processMakerChecker("NON_EXISTENT", true, "Manager"));
    }
}
