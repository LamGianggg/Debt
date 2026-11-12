package com.cactus.practice.entity;

import com.cactus.practice.dto.*;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class EntityAndDtoTest {

    @Test
    void testUserEntity() {
        User user = new User();
        user.setId(10L);
        user.setUsername("testuser");
        user.setEmail("test@debtmaster.vn");
        user.setPassword("secret");
        user.setEnabled(true);
        Set<RoleType> roles = new HashSet<>();
        roles.add(RoleType.ROLE_USER);
        user.setRoles(roles);

        assertEquals(10L, user.getId());
        assertEquals("testuser", user.getUsername());
        assertEquals("test@debtmaster.vn", user.getEmail());
        assertEquals("secret", user.getPassword());
        assertTrue(user.isEnabled());
        assertEquals(1, user.getRoles().size());
    }

    @Test
    void testCustomerEntity() {
        Customer customer = new Customer();
        customer.setId("cus_1");
        customer.setName("Minh Phat");
        customer.setEmail("mp@debtmaster.vn");
        customer.setPhone("0987654321");
        customer.setTotalSpent("$10,000.00 USD");
        customer.setBalance("$0.00 USD");
        customer.setPaymentsCount(5);
        customer.setCreated("Nov 01, 2026");
        customer.setStatus("Active");
        customer.setAddress("Hanoi");
        customer.setDefaultPayment("Visa");
        customer.setSubscriptions(Collections.emptyList());

        assertEquals("cus_1", customer.getId());
        assertEquals("Minh Phat", customer.getName());
        assertEquals("mp@debtmaster.vn", customer.getEmail());
        assertEquals("0987654321", customer.getPhone());
        assertEquals("$10,000.00 USD", customer.getTotalSpent());
        assertEquals("$0.00 USD", customer.getBalance());
        assertEquals(5, customer.getPaymentsCount());
        assertEquals("Nov 01, 2026", customer.getCreated());
        assertEquals("Active", customer.getStatus());
        assertEquals("Hanoi", customer.getAddress());
        assertEquals("Visa", customer.getDefaultPayment());
        assertNotNull(customer.getSubscriptions());
    }

    @Test
    void testTransactionEntity() {
        Transaction tx = new Transaction();
        tx.setId("ch_1");
        tx.setAmount("$100.00 USD");
        tx.setGross("$100.00 USD");
        tx.setFee("-$3.20 USD");
        tx.setNet("$96.80 USD");
        tx.setStatus("Succeeded");
        tx.setStatusType("success");
        tx.setCustomer("Hoang Phat");
        tx.setCustomerEmail("hp@debtmaster.vn");
        tx.setMethod("Visa");
        tx.setDate("Nov 01, 2026");
        tx.setRawAmount(new BigDecimal("100.00"));
        tx.setDescription("Debt payment");

        assertEquals("ch_1", tx.getId());
        assertEquals("$100.00 USD", tx.getAmount());
        assertEquals("$100.00 USD", tx.getGross());
        assertEquals("-$3.20 USD", tx.getFee());
        assertEquals("$96.80 USD", tx.getNet());
        assertEquals("Succeeded", tx.getStatus());
        assertEquals("success", tx.getStatusType());
        assertEquals("Hoang Phat", tx.getCustomer());
        assertEquals("hp@debtmaster.vn", tx.getCustomerEmail());
        assertEquals("Visa", tx.getMethod());
        assertEquals("Nov 01, 2026", tx.getDate());
        assertEquals(new BigDecimal("100.00"), tx.getRawAmount());
        assertEquals("Debt payment", tx.getDescription());
        assertNotNull(tx.getCreatedAt());
    }

    @Test
    void testProductEntity() {
        Product product = new Product();
        product.setId("prod_1");
        product.setName("Hop dong no");
        product.setDescription("Chi tiet");
        product.setPrice("$1,000.00 USD");
        product.setBilling("Recurring (Monthly)");
        product.setActiveSubscribers(10);
        product.setStatus("Active");
        product.setCreated("Nov 01, 2026");

        assertEquals("prod_1", product.getId());
        assertEquals("Hop dong no", product.getName());
        assertEquals("Chi tiet", product.getDescription());
        assertEquals("$1,000.00 USD", product.getPrice());
        assertEquals("Recurring (Monthly)", product.getBilling());
        assertEquals(10, product.getActiveSubscribers());
        assertEquals("Active", product.getStatus());
        assertEquals("Nov 01, 2026", product.getCreated());
    }

    @Test
    void testConnectedAccountEntity() {
        ConnectedAccount account = new ConnectedAccount();
        account.setId("acct_1");
        account.setName("Chi nhanh Hai Phong");
        account.setType("Dai ly");
        account.setEmail("hp@debtmaster.vn");
        account.setPatients(15);
        account.setDebtFiles(15);
        account.setGrossVolume("$20,000.00 USD");
        account.setStatus("Enabled");
        account.setStatusType("success");
        account.setLocation("Hai Phong");
        account.setPayoutBank("Vietcombank");

        assertEquals("acct_1", account.getId());
        assertEquals("Chi nhanh Hai Phong", account.getName());
        assertEquals("Dai ly", account.getType());
        assertEquals("hp@debtmaster.vn", account.getEmail());
        assertEquals(15, account.getPatients());
        assertEquals(15, account.getDebtFiles());
        assertEquals("$20,000.00 USD", account.getGrossVolume());
        assertEquals("Enabled", account.getStatus());
        assertEquals("success", account.getStatusType());
        assertEquals("Hai Phong", account.getLocation());
        assertEquals("Vietcombank", account.getPayoutBank());
    }

    @Test
    void testPayoutEntity() {
        Payout payout = new Payout();
        payout.setId("po_1");
        payout.setAmount("$5,000.00 USD");
        payout.setRawAmount(new BigDecimal("5000.00"));
        payout.setStatus("Paid");
        payout.setStatusType("success");
        payout.setDestination("Vietcombank");
        payout.setInitiated("Nov 01, 2026");
        payout.setArrival("Nov 02, 2026");
        payout.setType("Standard");

        assertEquals("po_1", payout.getId());
        assertEquals("$5,000.00 USD", payout.getAmount());
        assertEquals(new BigDecimal("5000.00"), payout.getRawAmount());
        assertEquals("Paid", payout.getStatus());
        assertEquals("success", payout.getStatusType());
        assertEquals("Vietcombank", payout.getDestination());
        assertEquals("Nov 01, 2026", payout.getInitiated());
        assertEquals("Nov 02, 2026", payout.getArrival());
        assertEquals("Standard", payout.getType());
    }

    @Test
    void testSubscriptionEntity() {
        Customer c = new Customer();
        Subscription sub = new Subscription();
        sub.setId("sub_1");
        sub.setCustomer(c);
        sub.setPlan("Hop dong 6 thang");
        sub.setAmount("$500.00 USD");
        sub.setStatus("Active");
        sub.setRenewal("Dec 01, 2026");

        assertEquals("sub_1", sub.getId());
        assertEquals(c, sub.getCustomer());
        assertEquals("Hop dong 6 thang", sub.getPlan());
        assertEquals("$500.00 USD", sub.getAmount());
        assertEquals("Active", sub.getStatus());
        assertEquals("Dec 01, 2026", sub.getRenewal());
    }

    @Test
    void testAllDtos() {
        // ApiResponse
        ApiResponse<String> apiResponse = new ApiResponse<>(true, "Msg", "Data", java.time.LocalDateTime.now());
        apiResponse.setSuccess(true);
        apiResponse.setMessage("New Msg");
        apiResponse.setData("New Data");
        apiResponse.setTimestamp(java.time.LocalDateTime.now());
        assertNotNull(apiResponse.getTimestamp());
        assertEquals("New Msg", apiResponse.getMessage());
        assertEquals("New Data", apiResponse.getData());
        assertTrue(apiResponse.isSuccess());

        ApiResponse<String> noArg = new ApiResponse<>();
        assertNotNull(noArg);

        ApiResponse<String> okDataOnly = ApiResponse.ok("JustData");
        assertEquals("JustData", okDataOnly.getData());
        assertTrue(okDataOnly.isSuccess());

        ApiResponse<String> okWithMsg = ApiResponse.ok("CustomMsg", "CustomData");
        assertEquals("CustomMsg", okWithMsg.getMessage());
        assertEquals("CustomData", okWithMsg.getData());

        ApiResponse<Void> err = ApiResponse.error("Err");
        assertFalse(err.isSuccess());

        // BalanceSummaryDto
        BalanceSummaryDto balanceDto = new BalanceSummaryDto();
        balanceDto.setAvailable("$100");
        balanceDto.setInTransit("$50");
        balanceDto.setTotalPayouts("$200");
        balanceDto.setRawAvailable(100.0);
        balanceDto.setRawInTransit(50.0);
        assertEquals("$100", balanceDto.getAvailable());
        assertEquals("$50", balanceDto.getInTransit());
        assertEquals("$200", balanceDto.getTotalPayouts());
        assertEquals(100.0, balanceDto.getRawAvailable());
        assertEquals(50.0, balanceDto.getRawInTransit());

        // ConnectedAccountRequest
        ConnectedAccountRequest car = new ConnectedAccountRequest();
        car.setName("Branch");
        car.setType("Agency");
        car.setEmail("b@test.com");
        car.setLocation("Hanoi");
        car.setPayoutBank("VCB");
        assertEquals("Branch", car.getName());
        assertEquals("Agency", car.getType());
        assertEquals("b@test.com", car.getEmail());
        assertEquals("Hanoi", car.getLocation());
        assertEquals("VCB", car.getPayoutBank());

        // CustomerRequest
        CustomerRequest cr = new CustomerRequest();
        cr.setName("Cust");
        cr.setEmail("c@test.com");
        cr.setPhone("123");
        cr.setAddress("Street");
        cr.setDefaultPayment("Cash");
        cr.setStatus("Active");
        assertEquals("Cust", cr.getName());
        assertEquals("c@test.com", cr.getEmail());
        assertEquals("123", cr.getPhone());
        assertEquals("Street", cr.getAddress());
        assertEquals("Cash", cr.getDefaultPayment());
        assertEquals("Active", cr.getStatus());

        // JwtResponse
        JwtResponse jwtResp = new JwtResponse("token", 1L, "user", "u@test.com", List.of("ROLE_USER"));
        jwtResp.setToken("t2");
        jwtResp.setType("Bearer");
        jwtResp.setId(2L);
        jwtResp.setUsername("u2");
        jwtResp.setEmail("u2@test.com");
        jwtResp.setRoles(List.of("ROLE_ADMIN"));
        assertEquals("t2", jwtResp.getToken());
        assertEquals("Bearer", jwtResp.getType());
        assertEquals(2L, jwtResp.getId());
        assertEquals("u2", jwtResp.getUsername());
        assertEquals("u2@test.com", jwtResp.getEmail());
        assertEquals(1, jwtResp.getRoles().size());

        // LoginRequest
        LoginRequest lr = new LoginRequest();
        lr.setUsername("loginUser");
        lr.setPassword("loginPass");
        assertEquals("loginUser", lr.getUsername());
        assertEquals("loginPass", lr.getPassword());

        // OverviewMetricsDto
        OverviewMetricsDto om = new OverviewMetricsDto();
        om.setTotalVolume("$100K");
        om.setNetRevenue("$80K");
        om.setActiveSubscriptions(10);
        om.setTotalCustomers(50);
        om.setVolumeGrowth("+10%");
        om.setTimeframe("30d");
        om.setRawTotalVolume(new BigDecimal("100000"));
        om.setRawNetRevenue(new BigDecimal("80000"));
        assertEquals("$100K", om.getTotalVolume());
        assertEquals("$80K", om.getNetRevenue());
        assertEquals(10, om.getActiveSubscriptions());
        assertEquals(50, om.getTotalCustomers());
        assertEquals("+10%", om.getVolumeGrowth());
        assertEquals("30d", om.getTimeframe());
        assertEquals(new BigDecimal("100000"), om.getRawTotalVolume());
        assertEquals(new BigDecimal("80000"), om.getRawNetRevenue());

        // PagedResponse
        PagedResponse<String> pr = new PagedResponse<>();
        pr.setContent(List.of("A", "B"));
        pr.setPage(0);
        pr.setSize(10);
        pr.setTotalElements(2L);
        pr.setTotalPages(1);
        pr.setLast(true);
        assertEquals(2, pr.getContent().size());
        assertEquals(0, pr.getPage());
        assertEquals(10, pr.getSize());
        assertEquals(2L, pr.getTotalElements());
        assertEquals(1, pr.getTotalPages());
        assertTrue(pr.isLast());

        // PaymentChargeRequest
        PaymentChargeRequest pcr = new PaymentChargeRequest();
        pcr.setAmount(new BigDecimal("50.00"));
        pcr.setCustomerId("cus_1");
        pcr.setCustomerName("Name");
        pcr.setCustomerEmail("email@test.com");
        pcr.setDescription("Desc");
        pcr.setMethod("Card");
        assertEquals(new BigDecimal("50.00"), pcr.getAmount());
        assertEquals("cus_1", pcr.getCustomerId());
        assertEquals("Name", pcr.getCustomerName());
        assertEquals("email@test.com", pcr.getCustomerEmail());
        assertEquals("Desc", pcr.getDescription());
        assertEquals("Card", pcr.getMethod());

        // PayoutRequest
        PayoutRequest por = new PayoutRequest();
        por.setAmount(new BigDecimal("100.00"));
        por.setDestination("Bank");
        por.setType("Instant");
        assertEquals(new BigDecimal("100.00"), por.getAmount());
        assertEquals("Bank", por.getDestination());
        assertEquals("Instant", por.getType());

        // ProductRequest
        ProductRequest prodr = new ProductRequest();
        prodr.setName("Prod");
        prodr.setDescription("Desc");
        prodr.setPrice("100");
        prodr.setBilling("One-time");
        assertEquals("Prod", prodr.getName());
        assertEquals("Desc", prodr.getDescription());
        assertEquals("100", prodr.getPrice());
        assertEquals("One-time", prodr.getBilling());

        // RegisterRequest
        RegisterRequest rr = new RegisterRequest();
        rr.setUsername("regUser");
        rr.setEmail("reg@test.com");
        rr.setPassword("regPass");
        rr.setRoles(Set.of("user"));
        assertEquals("regUser", rr.getUsername());
        assertEquals("reg@test.com", rr.getEmail());
        assertEquals("regPass", rr.getPassword());
        assertEquals(1, rr.getRoles().size());

        // ReportsDto
        ReportsDto rd = new ReportsDto();
        rd.setMrr("$10K");
        rd.setAov("$50");
        rd.setRefundRate("1%");
        rd.setTotalFees("$500");
        rd.setTotalTransactions(100);
        rd.setSuccessfulCharges(95);
        rd.setRefundedCharges(5);
        assertEquals("$10K", rd.getMrr());
        assertEquals("$50", rd.getAov());
        assertEquals("1%", rd.getRefundRate());
        assertEquals("$500", rd.getTotalFees());
        assertEquals(100, rd.getTotalTransactions());
        assertEquals(95, rd.getSuccessfulCharges());
        assertEquals(5, rd.getRefundedCharges());

        // SearchCriteria
        SearchCriteria sc = new SearchCriteria();
        sc.setKey("k");
        sc.setOperation(":");
        sc.setValue("v");
        assertEquals("k", sc.getKey());
        assertEquals(":", sc.getOperation());
        assertEquals("v", sc.getValue());

        // UserDto
        UserDto ud = new UserDto(1L, "admin", "admin@test.com", true, Set.of("ROLE_ADMIN"));
        ud.setId(2L);
        ud.setUsername("user2");
        ud.setEmail("u2@test.com");
        ud.setEnabled(false);
        ud.setRoles(Set.of("ROLE_USER"));
        assertEquals(2L, ud.getId());
        assertEquals("user2", ud.getUsername());
        assertEquals("u2@test.com", ud.getEmail());
        assertFalse(ud.isEnabled());
        assertEquals(1, ud.getRoles().size());
    }

    @Test
    void testO2CDtos() {
        O2CDtos parent = new O2CDtos();
        assertNotNull(parent);

        O2CDtos.SalesOrderDto so = new O2CDtos.SalesOrderDto();
        so.setId("SO-1");
        assertEquals("SO-1", so.getId());

        O2CDtos.InvoiceDto inv = new O2CDtos.InvoiceDto();
        inv.setId("INV-1");
        assertEquals("INV-1", inv.getId());

        O2CDtos.DunningItemDto dun = new O2CDtos.DunningItemDto();
        dun.setId("DUN-1");
        assertEquals("DUN-1", dun.getId());

        O2CDtos.PtpDisputeDto ptp = new O2CDtos.PtpDisputeDto();
        ptp.setId("PTP-1");
        assertEquals("PTP-1", ptp.getId());

        O2CDtos.BankReconciliationDto br = new O2CDtos.BankReconciliationDto();
        br.setTxId("TX-1");
        assertEquals("TX-1", br.getTxId());

        O2CDtos.MakerCheckerDto mc = new O2CDtos.MakerCheckerDto();
        mc.setId("MC-1");
        assertEquals("MC-1", mc.getId());

        O2CDtos.O2CKpisDto kpis = new O2CDtos.O2CKpisDto();
        kpis.setDsoDays("42 ngày");
        assertEquals("42 ngày", kpis.getDsoDays());
    }
}
