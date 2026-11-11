package com.cactus.practice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

public class O2CDtos {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SalesOrderDto implements Serializable {
        private String id;
        private String customerId;
        private String customerName;
        private String orderAmount;
        private String creditLimit;
        private String currentExposure;
        private String projectedExposure;
        private String creditUtilization;
        private String creditStatus; // PASS, WARNING, HARD_BLOCK
        private String riskCategory; // Low Risk, Medium Risk, High Risk
        private String approvalStatus; // AUTO_RELEASED, PENDING_APPROVAL, APPROVED, REJECTED
        private String createdDate;
        private String maker;
        private String checker;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InvoiceDto implements Serializable {
        private String id;
        private String salesOrderId;
        private String customerId;
        private String customerName;
        private String amount;
        private String remainingAmount;
        private String dueDate;
        // 4-Axis Statuses
        private String issueStatus; // DRAFT, ISSUED, CANCELLED
        private String taxAuthorityStatus; // SIGNED, SENT_TAX, TAX_ACCEPTED, TAX_REJECTED
        private String deliveryStatus; // DELIVERED, VIEWED, BOUNCED
        private String paymentStatus; // UNPAID, PARTIAL, PAID
        private String vietQrPayload;
        private String vietQrUrl;
        private String virtualAccount;
        private String xmlUrl;
        private String pdfUrl;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DunningItemDto implements Serializable {
        private String id;
        private String invoiceId;
        private String customerName;
        private String cadenceStep; // T-3, T, T+7, T+15, T+30
        private int overdueDays;
        private String amount;
        private String contactPerson;
        private String channel; // Email, ZNS, Phone, Official Letter
        private String status; // SENT, PENDING, ESCALATED
        private String sentTime;
        private String nextAction;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PtpDisputeDto implements Serializable {
        private String id;
        private String type; // PTP, DISPUTE
        private String customerName;
        private String invoiceId;
        private String amount;
        private String committedDate;
        private int brokenPtpCount;
        private String reason;
        private String disputeRootCause; // NONE, PRICING_ERROR, DEFECTIVE_GOODS, BILLING_QUANTITY
        private int slaRemainingHours;
        private String status; // ACTIVE, RESOLVED, BREACHED
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BankReconciliationDto implements Serializable {
        private String txId;
        private String bank;
        private String amount;
        private String senderName;
        private String narrative;
        private String tierMatched; // Tier 1: VA Exact, Tier 2: Ref + Amount, Tier 3: Fuzzy NLP, Tier 4: Manual
        private String matchConfidence;
        private String status; // AUTO_RECONCILED, MANUAL_PENDING, DE_MINIMIS_WRITTEN_OFF
        private String deMinimisDiff;
        private String reconciledAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MakerCheckerDto implements Serializable {
        private String id;
        private String actionType; // CREDIT_OVERRIDE, WRITE_OFF, DISPUTE_CREDIT_MEMO
        private String title;
        private String details;
        private String maker;
        private String makerDate;
        private String checker;
        private String status; // PENDING, APPROVED, REJECTED
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class O2CKpisDto implements Serializable {
        private String dsoDays;
        private String ceiPercent;
        private String totalReceivables;
        private String currentAging0to30;
        private String aging31to60;
        private String aging61to90;
        private String agingOver90;
        private String brokenPtpRate;
        private String autoMatchRate;
        private int deMinimisWriteOffCount;
        private int pendingApprovalsCount;
    }
}
