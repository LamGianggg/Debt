package com.cactus.practice.service;

import com.cactus.practice.HibernateDao.PayoutHibernateDao;
import com.cactus.practice.dto.BalanceSummaryDto;
import com.cactus.practice.dto.PagedResponse;
import com.cactus.practice.dto.PayoutRequest;
import com.cactus.practice.entity.Payout;
import com.cactus.practice.repository.PayoutRepository;
import com.cactus.practice.service.impl.PayoutServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PayoutServiceImplTest {

    @Mock
    private PayoutRepository payoutRepository;

    @Mock
    private PayoutHibernateDao payoutHibernateDao;

    @InjectMocks
    private PayoutServiceImpl payoutService;

    @Test
    void testGetAllPayouts() {
        Payout po = new Payout("po_1", "$5,000.00 USD", new BigDecimal("5000.00"), "Paid", "success", "Vietcombank •••• 1234", "Nov 01, 2026", "Nov 02, 2026", "Standard");
        when(payoutRepository.findAllByOrderByCreatedAtDesc()).thenReturn(Collections.singletonList(po));

        List<Payout> list = payoutService.getAllPayouts();
        assertEquals(1, list.size());
        assertEquals("po_1", list.get(0).getId());
    }

    @Test
    void testCreatePayout_Standard() {
        PayoutRequest req = new PayoutRequest(new BigDecimal("3000.00"), "Standard", "Techcombank •••• 7714");
        when(payoutRepository.save(any(Payout.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Payout created = payoutService.createPayout(req);
        assertNotNull(created);
        assertEquals("In Transit", created.getStatus());
        assertEquals("pending", created.getStatusType());
    }

    @Test
    void testCreatePayout_Instant() {
        PayoutRequest req = new PayoutRequest(new BigDecimal("1500.00"), "Instant", "BIDV •••• 9940");
        when(payoutRepository.save(any(Payout.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Payout created = payoutService.createPayout(req);
        assertNotNull(created);
        assertEquals("Paid", created.getStatus());
        assertEquals("success", created.getStatusType());
    }

    @Test
    void testCreatePayout_NullTypeAndDestination() {
        PayoutRequest req = new PayoutRequest(new BigDecimal("500.00"), null, null);
        when(payoutRepository.save(any(Payout.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Payout created = payoutService.createPayout(req);
        assertNotNull(created);
        assertEquals("In Transit", created.getStatus());
        assertEquals("Chase Bank •••• 8841", created.getDestination());
        assertEquals("Standard Automated", created.getType());
    }

    @Test
    void testGetBalanceSummary() {
        Payout p1 = new Payout("po_1", "$5,000.00 USD", new BigDecimal("5000.00"), "In Transit", "pending", "VCB", "date", "date", "type");
        Payout p2 = new Payout("po_2", "$1,000.00 USD", null, "Paid", "success", "TCB", "date", "date", "type");
        Payout p3 = new Payout("po_3", "invalid-amt", null, "Failed", "failed", "BIDV", "date", "date", "type");
        Payout p4 = new Payout("po_4", null, null, "Canceled", "canceled", "AGRI", "date", "date", "type");

        when(payoutRepository.findAll()).thenReturn(List.of(p1, p2, p3, p4));

        BalanceSummaryDto summary = payoutService.getBalanceSummary();
        assertNotNull(summary);
        assertNotNull(summary.getAvailable());
        assertEquals("$5,000.00", summary.getInTransit());
        assertEquals("$1,000.00", summary.getTotalPayouts());
    }

    @Test
    void testFilterPayouts() {
        Payout po = new Payout("po_1", "$5,000.00 USD", new BigDecimal("5000.00"), "Paid", "success", "Vietcombank •••• 1234", "Nov 01, 2026", "Nov 02, 2026", "Standard");
        Page<Payout> page = new PageImpl<>(Collections.singletonList(po), PageRequest.of(0, 10), 1);
        when(payoutHibernateDao.filter("Vietcombank", 0, 10, "createdAt", "desc")).thenReturn(page);

        PagedResponse<Payout> response = payoutService.filterPayouts("Vietcombank", 0, 10, "createdAt", "desc");
        assertNotNull(response);
        assertEquals(1, response.getContent().size());
    }
}
