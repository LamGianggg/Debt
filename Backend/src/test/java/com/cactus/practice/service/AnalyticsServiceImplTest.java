package com.cactus.practice.service;

import com.cactus.practice.dto.OverviewMetricsDto;
import com.cactus.practice.dto.ReportsDto;
import com.cactus.practice.entity.Customer;
import com.cactus.practice.entity.Subscription;
import com.cactus.practice.entity.Transaction;
import com.cactus.practice.repository.CustomerRepository;
import com.cactus.practice.repository.SubscriptionRepository;
import com.cactus.practice.repository.TransactionRepository;
import com.cactus.practice.service.impl.AnalyticsServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AnalyticsServiceImplTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private SubscriptionRepository subscriptionRepository;

    @InjectMocks
    private AnalyticsServiceImpl analyticsService;

    @Test
    void testGetOverview() {
        Transaction tx = new Transaction("ch_1", "$100.00 USD", "$100.00 USD", "-$3.20 USD", "$96.80 USD", "Succeeded", "success", "Hoang Phat", "hp@example.com", "Visa", "Nov 01, 2026", new BigDecimal("100.00"), "Debt settlement");
        Customer c = new Customer("cus_1", "Hoang Phat", "hp@example.com", "0901234567", "$0.00", "$0.00", 0, "Nov 01, 2026", "Active", "Ha Noi", "Visa •••• 4242");
        Subscription s = new Subscription("sub_1", c, "Goi 12 thang", "$990.00 USD / mo", "Active", "Dec 01, 2026");

        when(transactionRepository.findAll()).thenReturn(Collections.singletonList(tx));
        when(customerRepository.findAll()).thenReturn(Collections.singletonList(c));
        when(subscriptionRepository.findAll()).thenReturn(Collections.singletonList(s));

        OverviewMetricsDto metrics = analyticsService.getOverview("month");
        assertNotNull(metrics);
        assertNotNull(metrics.getTotalVolume());
        assertEquals(1482, metrics.getTotalCustomers());
    }

    @Test
    void testGetReports() {
        ReportsDto reports = analyticsService.getReports();
        assertNotNull(reports);
        assertNotNull(reports.getMrr());
        assertNotNull(reports.getRefundRate());
    }
}
