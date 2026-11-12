package com.cactus.practice.rest;

import com.cactus.practice.dto.ApiResponse;
import com.cactus.practice.dto.O2CDtos.*;
import com.cactus.practice.service.O2CWorkflowService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/o2c")
@Tag(name = "O2C & AR Automation Workflow", description = "Endpoints for Order-to-Cash, Credit Control, 4-Axis e-Invoicing, VietQR, Dunning, PTP/Disputes, Bank Reconciliation & Maker-Checker with RBAC Enforcement")
public class O2CWorkflowController {

    private final O2CWorkflowService o2cService;

    @Autowired
    public O2CWorkflowController(O2CWorkflowService o2cService) {
        this.o2cService = o2cService;
    }

    @GetMapping("/kpis")
    @Operation(summary = "Get high-level O2C executive AR KPIs (DSO, CEI, Aging brackets, Auto-match rate)")
    public ResponseEntity<ApiResponse<O2CKpisDto>> getKpis(
            @RequestHeader(value = "X-User-Role", required = false, defaultValue = "ROLE_USER") String userRole
    ) {
        return ResponseEntity.ok(ApiResponse.ok("O2C KPIs retrieved", o2cService.getKpis()));
    }

    @GetMapping("/orders")
    @Operation(summary = "Get Sales Orders with credit exposure evaluation and hard-block checks")
    public ResponseEntity<ApiResponse<List<SalesOrderDto>>> getOrders() {
        return ResponseEntity.ok(ApiResponse.ok("Sales Orders retrieved", o2cService.getSalesOrders()));
    }

    @PostMapping("/orders/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Maker-Checker approval to release a credit-blocked order (ROLE_ADMIN required)")
    public ResponseEntity<ApiResponse<SalesOrderDto>> approveOrder(
            @PathVariable String id,
            @RequestParam(defaultValue = "Admin / Credit Manager") String approver,
            @RequestHeader(value = "X-User-Role", required = false, defaultValue = "ROLE_USER") String userRole
    ) {
        if (!"ROLE_ADMIN".equalsIgnoreCase(userRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Lỗi 403 Forbidden: Chỉ Quản trị viên (ROLE_ADMIN) mới có quyền duyệt mở khóa đơn hàng vượt hạn mức tín dụng (Four-Eyes Principle)!"));
        }
        SalesOrderDto updated = o2cService.approveOrderCredit(id, approver);
        if (updated == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Order not found: " + id));
        }
        return ResponseEntity.ok(ApiResponse.ok("Order approved and released successfully", updated));
    }

    @GetMapping("/invoices")
    @Operation(summary = "Get e-Invoices with 4-axis statuses, Dynamic VietQR payload, and Virtual Account")
    public ResponseEntity<ApiResponse<List<InvoiceDto>>> getInvoices() {
        return ResponseEntity.ok(ApiResponse.ok("Invoices retrieved", o2cService.getInvoices()));
    }

    @PostMapping("/invoices/{id}/pay")
    @Operation(summary = "Record payment for an invoice (Cash Application)")
    public ResponseEntity<ApiResponse<InvoiceDto>> payInvoice(
            @PathVariable String id,
            @RequestBody(required = false) Map<String, String> body
    ) {
        String amount = body != null ? body.getOrDefault("amount", "Full") : "Full";
        InvoiceDto updated = o2cService.payInvoice(id, amount);
        if (updated == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invoice not found: " + id));
        }
        return ResponseEntity.ok(ApiResponse.ok("Invoice marked as PAID via Bank Cash Application", updated));
    }

    @GetMapping("/dunning")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Get automated collection dunning worklist across T-3 to T+30 cadences (Internal Staff/Admin only)")
    public ResponseEntity<ApiResponse<?>> getDunningWorklist(
            @RequestHeader(value = "X-User-Role", required = false, defaultValue = "ROLE_USER") String userRole
    ) {
        if ("ROLE_USER".equalsIgnoreCase(userRole) || "GUEST".equalsIgnoreCase(userRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Lỗi 403 Forbidden: Khách hàng (User/Guest) bị cấm truy cập Bàn thu nợ nội bộ!"));
        }
        return ResponseEntity.ok(ApiResponse.ok("Dunning worklist retrieved", o2cService.getDunningWorklist()));
    }

    @PostMapping("/dunning/{id}/send")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Trigger multi-channel automated reminder (Email, ZNS, Official Letter)")
    public ResponseEntity<ApiResponse<?>> sendDunningNotice(
            @PathVariable String id,
            @RequestHeader(value = "X-User-Role", required = false, defaultValue = "ROLE_USER") String userRole
    ) {
        if ("ROLE_USER".equalsIgnoreCase(userRole) || "GUEST".equalsIgnoreCase(userRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Lỗi 403 Forbidden: Khách hàng (User/Guest) không có quyền phát lệnh thu hồi nợ!"));
        }
        DunningItemDto updated = o2cService.sendDunningReminder(id);
        if (updated == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Dunning item not found: " + id));
        }
        return ResponseEntity.ok(ApiResponse.ok("Dunning reminder dispatched successfully", updated));
    }

    @GetMapping("/ptp-disputes")
    @Operation(summary = "Get Promise-to-Pay commitments and 72-hour SLA Dispute tickets")
    public ResponseEntity<ApiResponse<List<PtpDisputeDto>>> getPtpDisputes() {
        return ResponseEntity.ok(ApiResponse.ok("PTP and Disputes retrieved", o2cService.getPtpDisputes()));
    }

    @PostMapping("/ptp")
    @Operation(summary = "Submit a Promise-to-Pay (PTP) commitment with broken-count verification")
    public ResponseEntity<ApiResponse<PtpDisputeDto>> createPtp(@RequestBody PtpDisputeDto dto) {
        PtpDisputeDto created = o2cService.createPtp(dto);
        return ResponseEntity.ok(ApiResponse.ok("PTP commitment logged successfully", created));
    }

    @PostMapping("/disputes/{id}/resolve")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Resolve dispute ticket within 72h SLA with credit memo / adjustment (ROLE_ADMIN required)")
    public ResponseEntity<ApiResponse<PtpDisputeDto>> resolveDispute(
            @PathVariable String id,
            @RequestBody Map<String, String> body,
            @RequestHeader(value = "X-User-Role", required = false, defaultValue = "ROLE_USER") String userRole
    ) {
        if (!"ROLE_ADMIN".equalsIgnoreCase(userRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Lỗi 403 Forbidden: Chỉ Quản trị viên (ROLE_ADMIN) mới có quyền duyệt giải quyết Tranh chấp và xuất Giảm trừ nợ (Credit Memo)!"));
        }
        String resolution = body != null ? body.getOrDefault("resolution", "Đã giải quyết theo biên bản đối soát") : "Resolved";
        PtpDisputeDto updated = o2cService.resolveDispute(id, resolution);
        if (updated == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Dispute not found: " + id));
        }
        return ResponseEntity.ok(ApiResponse.ok("Dispute resolved successfully", updated));
    }

    @GetMapping("/reconciliation")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Get 4-tier bank feeds and automated cash matching status (Internal Staff/Admin only)")
    public ResponseEntity<ApiResponse<?>> getReconciliation(
            @RequestHeader(value = "X-User-Role", required = false, defaultValue = "ROLE_USER") String userRole
    ) {
        if ("ROLE_USER".equalsIgnoreCase(userRole) || "GUEST".equalsIgnoreCase(userRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Lỗi 403 Forbidden: Khách hàng (User/Guest) bị cấm truy cập Sổ phụ và Đối soát ngân hàng nội bộ!"));
        }
        return ResponseEntity.ok(ApiResponse.ok("Bank reconciliation feeds retrieved", o2cService.getReconciliationFeeds()));
    }

    @PostMapping("/reconciliation/{txId}/de-minimis")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Apply De Minimis policy write-off (diff <= 50,000 VND) (ROLE_ADMIN required)")
    public ResponseEntity<ApiResponse<BankReconciliationDto>> applyDeMinimis(
            @PathVariable String txId,
            @RequestHeader(value = "X-User-Role", required = false, defaultValue = "ROLE_USER") String userRole
    ) {
        if (!"ROLE_ADMIN".equalsIgnoreCase(userRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Lỗi 403 Forbidden: Chỉ Quản trị viên (ROLE_ADMIN) mới có quyền duyệt xóa nợ De Minimis!"));
        }
        BankReconciliationDto updated = o2cService.applyDeMinimis(txId);
        if (updated == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Transaction feed not found: " + txId));
        }
        return ResponseEntity.ok(ApiResponse.ok("De Minimis policy applied successfully", updated));
    }

    @GetMapping("/maker-checker")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @Operation(summary = "Get Maker-Checker dual control pending approvals (Internal Staff/Admin only)")
    public ResponseEntity<ApiResponse<?>> getMakerChecker(
            @RequestHeader(value = "X-User-Role", required = false, defaultValue = "ROLE_USER") String userRole
    ) {
        if ("ROLE_USER".equalsIgnoreCase(userRole) || "GUEST".equalsIgnoreCase(userRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Lỗi 403 Forbidden: Khách hàng (User/Guest) bị cấm truy cập Hàng chờ Maker-Checker!"));
        }
        return ResponseEntity.ok(ApiResponse.ok("Maker-Checker requests retrieved", o2cService.getMakerCheckerRequests()));
    }

    @PostMapping("/maker-checker/{id}/process")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Process Maker-Checker approval or rejection (ROLE_ADMIN / Checker required)")
    public ResponseEntity<ApiResponse<MakerCheckerDto>> processMakerChecker(
            @PathVariable String id,
            @RequestBody Map<String, Object> body,
            @RequestHeader(value = "X-User-Role", required = false, defaultValue = "ROLE_USER") String userRole
    ) {
        String role = body != null && body.containsKey("role") ? String.valueOf(body.get("role")) : userRole;
        if (!"ROLE_ADMIN".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Lỗi 403 Forbidden: Segregation of Duties (SoD) - Nhân viên (Staff/Maker) hoặc Khách hàng bị cấm phê duyệt yêu cầu Maker-Checker!"));
        }
        boolean approved = Boolean.parseBoolean(String.valueOf(body != null ? body.getOrDefault("approved", true) : true));
        String checker = String.valueOf(body != null ? body.getOrDefault("checker", "Admin / Head of Credit") : "Admin / Head of Credit");
        MakerCheckerDto updated = o2cService.processMakerChecker(id, approved, checker);
        if (updated == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Maker-Checker request not found: " + id));
        }
        return ResponseEntity.ok(ApiResponse.ok("Maker-Checker decision executed", updated));
    }
}
