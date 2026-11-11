package com.cactus.practice.service;

import com.cactus.practice.dto.O2CDtos.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class O2CWorkflowService {

    private final List<SalesOrderDto> salesOrders = new CopyOnWriteArrayList<>();
    private final List<InvoiceDto> invoices = new CopyOnWriteArrayList<>();
    private final List<DunningItemDto> dunningItems = new CopyOnWriteArrayList<>();
    private final List<PtpDisputeDto> ptpDisputes = new CopyOnWriteArrayList<>();
    private final List<BankReconciliationDto> reconciliations = new CopyOnWriteArrayList<>();
    private final List<MakerCheckerDto> makerCheckerList = new CopyOnWriteArrayList<>();

    public O2CWorkflowService() {
        initMockData();
    }

    private void initMockData() {
        // 1. Sales Orders
        salesOrders.add(SalesOrderDto.builder()
                .id("SO-2026-081")
                .customerId("cus_DEBT_001")
                .customerName("Công ty TNHH Hoàng Phát")
                .orderAmount("450.000.000 ₫")
                .creditLimit("500.000.000 ₫")
                .currentExposure("320.000.000 ₫")
                .projectedExposure("770.000.000 ₫")
                .creditUtilization("154%")
                .creditStatus("HARD_BLOCK")
                .riskCategory("High Risk")
                .approvalStatus("PENDING_APPROVAL")
                .createdDate("2026-11-10 09:30")
                .maker("Nguyễn Văn Tuấn (Sales Rep)")
                .checker("Chờ Admin/Credit Manager duyệt")
                .build());

        salesOrders.add(SalesOrderDto.builder()
                .id("SO-2026-082")
                .customerId("cus_DEBT_002")
                .customerName("Tập đoàn Xây dựng An Bình")
                .orderAmount("1.200.000.000 ₫")
                .creditLimit("3.000.000.000 ₫")
                .currentExposure("850.000.000 ₫")
                .projectedExposure("2.050.000.000 ₫")
                .creditUtilization("68%")
                .creditStatus("PASS")
                .riskCategory("Low Risk")
                .approvalStatus("AUTO_RELEASED")
                .createdDate("2026-11-10 11:15")
                .maker("Hệ thống tự động (Auto Credit Rule)")
                .checker("Auto Passed")
                .build());

        salesOrders.add(SalesOrderDto.builder()
                .id("SO-2026-083")
                .customerId("cus_DEBT_003")
                .customerName("Công ty CP Công Nghệ Việt")
                .orderAmount("180.000.000 ₫")
                .creditLimit("200.000.000 ₫")
                .currentExposure("150.000.000 ₫")
                .projectedExposure("330.000.000 ₫")
                .creditUtilization("165%")
                .creditStatus("HARD_BLOCK")
                .riskCategory("Medium Risk")
                .approvalStatus("APPROVED")
                .createdDate("2026-11-09 14:00")
                .maker("Lê Thu Hà (Account Manager)")
                .checker("Phan Minh (Admin - Đã duyệt)")
                .build());

        // 2. Invoices (4-Axis e-Invoicing)
        invoices.add(InvoiceDto.builder()
                .id("INV-2026-0091")
                .salesOrderId("SO-2026-077")
                .customerId("cus_DEBT_001")
                .customerName("Công ty TNHH Hoàng Phát")
                .amount("380.000.000 ₫")
                .remainingAmount("380.000.000 ₫")
                .dueDate("2026-11-15")
                .issueStatus("ISSUED")
                .taxAuthorityStatus("TAX_ACCEPTED")
                .deliveryStatus("DELIVERED")
                .paymentStatus("UNPAID")
                .vietQrPayload("00020101021238580010A000000727012800069704070114902123456789010208QRIBFTTA530370454093800000005802VN62210817INV-2026-00916304C92A")
                .vietQrUrl("https://img.vietqr.io/image/970407-90212345678901-compact2.png?amount=380000000&addInfo=INV-2026-0091&accountName=CONG%20TY%20CP%20DEBTMASTER")
                .virtualAccount("90212345678901 (TCB-VA)")
                .xmlUrl("/api/o2c/invoices/INV-2026-0091/xml")
                .pdfUrl("/api/o2c/invoices/INV-2026-0091/pdf")
                .build());

        invoices.add(InvoiceDto.builder()
                .id("INV-2026-0088")
                .salesOrderId("SO-2026-071")
                .customerId("cus_DEBT_002")
                .customerName("Tập đoàn Xây dựng An Bình")
                .amount("1.250.000.000 ₫")
                .remainingAmount("1.250.000.000 ₫")
                .dueDate("2026-10-25")
                .issueStatus("ISSUED")
                .taxAuthorityStatus("TAX_ACCEPTED")
                .deliveryStatus("VIEWED")
                .paymentStatus("UNPAID")
                .vietQrPayload("00020101021238580010A000000727012800069704070114902123456789020208QRIBFTTA5303704541012500000005802VN62210817INV-2026-00886304A1B2")
                .vietQrUrl("https://img.vietqr.io/image/970407-90212345678902-compact2.png?amount=1250000000&addInfo=INV-2026-0088&accountName=CONG%20TY%20CP%20DEBTMASTER")
                .virtualAccount("90212345678902 (TCB-VA)")
                .xmlUrl("/api/o2c/invoices/INV-2026-0088/xml")
                .pdfUrl("/api/o2c/invoices/INV-2026-0088/pdf")
                .build());

        invoices.add(InvoiceDto.builder()
                .id("INV-2026-0077")
                .salesOrderId("SO-2026-065")
                .customerId("cus_DEBT_004")
                .customerName("Thương Mại & Dịch Vụ Đại Nam")
                .amount("890.000.000 ₫")
                .remainingAmount("0 ₫")
                .dueDate("2026-11-02")
                .issueStatus("ISSUED")
                .taxAuthorityStatus("TAX_ACCEPTED")
                .deliveryStatus("DELIVERED")
                .paymentStatus("PAID")
                .vietQrPayload("00020101021238580010A000000727012800069704070114902123456789040208QRIBFTTA530370454098900000005802VN62210817INV-2026-00776304DD89")
                .vietQrUrl("https://img.vietqr.io/image/970407-90212345678904-compact2.png?amount=890000000&addInfo=INV-2026-0077&accountName=CONG%20TY%20CP%20DEBTMASTER")
                .virtualAccount("90212345678904 (TCB-VA)")
                .xmlUrl("/api/o2c/invoices/INV-2026-0077/xml")
                .pdfUrl("/api/o2c/invoices/INV-2026-0077/pdf")
                .build());

        // 3. Dunning Cadence
        dunningItems.add(DunningItemDto.builder()
                .id("DUN-2026-042")
                .invoiceId("INV-2026-0088")
                .customerName("Tập đoàn Xây dựng An Bình")
                .cadenceStep("T+15 (Escalated Demand)")
                .overdueDays(16)
                .amount("1.250.000.000 ₫")
                .contactPerson("Trần Quốc Toản (CFO)")
                .channel("ZNS + Email & Công văn phát chuyển nhanh")
                .status("SENT")
                .sentTime("2026-11-10 14:15")
                .nextAction("T+30: Pháp lý & Đình chỉ tín dụng")
                .build());

        dunningItems.add(DunningItemDto.builder()
                .id("DUN-2026-041")
                .invoiceId("INV-2026-0065")
                .customerName("Doanh nghiệp Tư nhân Minh Phát")
                .cadenceStep("T+30 (Legal Notice & Suspension)")
                .overdueDays(34)
                .amount("420.000.000 ₫")
                .contactPerson("Lê Văn Minh (Giám đốc)")
                .channel("Công văn Pháp lý & Đình chỉ giao dịch")
                .status("ESCALATED")
                .sentTime("2026-11-08 09:00")
                .nextAction("Chuyển hồ sơ Tòa án / Trọng tài VIAC")
                .build());

        dunningItems.add(DunningItemDto.builder()
                .id("DUN-2026-040")
                .invoiceId("INV-2026-0091")
                .customerName("Công ty TNHH Hoàng Phát")
                .cadenceStep("T-3 (Friendly Pre-due Notice)")
                .overdueDays(0)
                .amount("380.000.000 ₫")
                .contactPerson("Lê Hoàng Nam (Kế toán trưởng)")
                .channel("Email tự động + ZNS kèm VietQR link")
                .status("SENT")
                .sentTime("2026-11-11 08:00")
                .nextAction("T+0: Nhắc ngày đáo hạn")
                .build());

        // 4. PTP & Disputes
        ptpDisputes.add(PtpDisputeDto.builder()
                .id("PTP-2026-015")
                .type("PTP")
                .customerName("Doanh nghiệp Tư nhân Minh Phát")
                .invoiceId("INV-2026-0065")
                .amount("420.000.000 ₫")
                .committedDate("2026-11-18")
                .brokenPtpCount(1)
                .reason("Chờ nguồn thanh toán từ chủ đầu tư công trình VSIP")
                .disputeRootCause("NONE")
                .slaRemainingHours(48)
                .status("ACTIVE")
                .build());

        ptpDisputes.add(PtpDisputeDto.builder()
                .id("DIS-2026-008")
                .type("DISPUTE")
                .customerName("Tập đoàn Xây dựng An Bình")
                .invoiceId("INV-2026-0088")
                .amount("150.000.000 ₫")
                .committedDate("2026-11-14")
                .brokenPtpCount(0)
                .reason("Khiếu nại sai đơn giá 15 tấn thép cuộn tại đợt giao số 3")
                .disputeRootCause("PRICING_ERROR")
                .slaRemainingHours(24)
                .status("ACTIVE")
                .build());

        // 5. Bank Reconciliation Feeds
        reconciliations.add(BankReconciliationDto.builder()
                .txId("BNK-TX-9921")
                .bank("Techcombank API Feed")
                .amount("380.000.000 ₫")
                .senderName("CONG TY TNHH HOANG PHAT")
                .narrative("THANH TOAN HOA DON INV-2026-0091 HOANG PHAT VA 90212345678901")
                .tierMatched("Tier 1: 100% Virtual Account Exact Match")
                .matchConfidence("100%")
                .status("AUTO_RECONCILED")
                .deMinimisDiff("0 ₫")
                .reconciledAt("2026-11-11 04:12")
                .build());

        reconciliations.add(BankReconciliationDto.builder()
                .txId("BNK-TX-9920")
                .bank("Vietcombank Corporate Feed")
                .amount("889.980.000 ₫")
                .senderName("THUONG MAI DAI NAM")
                .narrative("DAI NAM CK TIEN HANG INV-2026-0077 THIEU 20K PHI")
                .tierMatched("Tier 2: Exact Amount & Invoice Ref Match")
                .matchConfidence("99.9%")
                .status("DE_MINIMIS_WRITTEN_OFF")
                .deMinimisDiff("20.000 ₫ (Đã tự động cấn trừ De Minimis)")
                .reconciledAt("2026-11-10 16:20")
                .build());

        reconciliations.add(BankReconciliationDto.builder()
                .txId("BNK-TX-9919")
                .bank("MBBank Business Feed")
                .amount("75.000.000 ₫")
                .senderName("AN BINH CORP")
                .narrative("AN BINH TAM UNG HOP DONG CUNG CAP")
                .tierMatched("Tier 3: Fuzzy NLP Matching")
                .matchConfidence("84.5%")
                .status("MANUAL_PENDING")
                .deMinimisDiff("0 ₫")
                .reconciledAt("2026-11-10 11:05")
                .build());

        // 6. Maker-Checker
        makerCheckerList.add(MakerCheckerDto.builder()
                .id("MC-2026-029")
                .actionType("CREDIT_OVERRIDE")
                .title("Phê duyệt vượt hạn mức tín dụng 270.000.000 ₫ - Hoàng Phát")
                .details("Khách hàng có lịch sử tín dụng Hạng A, tài sản thế chấp bổ sung 1 tỷ VNĐ.")
                .maker("Trần Tuấn (Credit Analyst)")
                .makerDate("2026-11-10 16:40")
                .checker("Phan Minh (Admin - Đang chờ)")
                .status("PENDING")
                .build());

        makerCheckerList.add(MakerCheckerDto.builder()
                .id("MC-2026-028")
                .actionType("WRITE_OFF")
                .title("Tất toán nợ xấu tổn thất 15.000.000 ₫ - Cửa hàng Minh Trí")
                .details("Đối tác giải thể doanh nghiệp, đã trích lập dự phòng 100%.")
                .maker("Lê Thu Hà (AR Staff)")
                .makerDate("2026-11-09 11:15")
                .checker("Phan Minh (Admin - Đã duyệt)")
                .status("APPROVED")
                .build());
    }

    public O2CKpisDto getKpis() {
        return O2CKpisDto.builder()
                .dsoDays("42.5 ngày (Mục tiêu: ≤ 45 ngày)")
                .ceiPercent("88.4% (Chuẩn Top-Quartile B2B)")
                .totalReceivables("14.280.000.000 ₫")
                .currentAging0to30("8.950.000.000 ₫ (62.7%)")
                .aging31to60("3.120.000.000 ₫ (21.8%)")
                .aging61to90("1.450.000.000 ₫ (10.2%)")
                .agingOver90("760.000.000 ₫ (5.3% - Cảnh báo nợ xấu)")
                .brokenPtpRate("4.2%")
                .autoMatchRate("92.8% (Tier 1-2 Automated Cash App)")
                .deMinimisWriteOffCount(12)
                .pendingApprovalsCount((int) makerCheckerList.stream().filter(m -> "PENDING".equals(m.getStatus())).count())
                .build();
    }

    public List<SalesOrderDto> getSalesOrders() {
        return salesOrders;
    }

    public SalesOrderDto approveOrderCredit(String orderId, String approver) {
        for (SalesOrderDto so : salesOrders) {
            if (so.getId().equalsIgnoreCase(orderId)) {
                so.setApprovalStatus("APPROVED");
                so.setCreditStatus("PASS");
                so.setChecker(approver + " (Đã phê duyệt ngoại lệ tín dụng)");
                return so;
            }
        }
        return null;
    }

    public List<InvoiceDto> getInvoices() {
        return invoices;
    }

    public InvoiceDto payInvoice(String invoiceId, String amount) {
        for (InvoiceDto inv : invoices) {
            if (inv.getId().equalsIgnoreCase(invoiceId)) {
                inv.setPaymentStatus("PAID");
                inv.setRemainingAmount("0 ₫");
                return inv;
            }
        }
        return null;
    }

    public List<DunningItemDto> getDunningWorklist() {
        return dunningItems;
    }

    public DunningItemDto sendDunningReminder(String id) {
        for (DunningItemDto item : dunningItems) {
            if (item.getId().equalsIgnoreCase(id)) {
                item.setStatus("SENT");
                item.setSentTime("Vừa gửi qua ZNS + Email");
                return item;
            }
        }
        return null;
    }

    public List<PtpDisputeDto> getPtpDisputes() {
        return ptpDisputes;
    }

    public PtpDisputeDto createPtp(PtpDisputeDto dto) {
        if (dto.getId() == null) {
            dto.setId("PTP-" + System.currentTimeMillis() % 10000);
        }
        dto.setStatus("ACTIVE");
        ptpDisputes.add(0, dto);
        return dto;
    }

    public PtpDisputeDto resolveDispute(String id, String resolution) {
        for (PtpDisputeDto item : ptpDisputes) {
            if (item.getId().equalsIgnoreCase(id)) {
                item.setStatus("RESOLVED");
                item.setReason(item.getReason() + " | Đã giải quyết: " + resolution);
                return item;
            }
        }
        return null;
    }

    public List<BankReconciliationDto> getReconciliationFeeds() {
        return reconciliations;
    }

    public BankReconciliationDto applyDeMinimis(String txId) {
        for (BankReconciliationDto item : reconciliations) {
            if (item.getTxId().equalsIgnoreCase(txId)) {
                item.setStatus("DE_MINIMIS_WRITTEN_OFF");
                item.setDeMinimisDiff("Đã cấn trừ De Minimis (≤ 50.000 VNĐ)");
                return item;
            }
        }
        return null;
    }

    public List<MakerCheckerDto> getMakerCheckerRequests() {
        return makerCheckerList;
    }

    public MakerCheckerDto processMakerChecker(String reqId, boolean approved, String checkerName) {
        for (MakerCheckerDto mc : makerCheckerList) {
            if (mc.getId().equalsIgnoreCase(reqId)) {
                mc.setStatus(approved ? "APPROVED" : "REJECTED");
                mc.setChecker(checkerName + (approved ? " (Đã duyệt)" : " (Từ chối)"));
                return mc;
            }
        }
        return null;
    }
}
