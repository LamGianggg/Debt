package com.cactus.practice.rest;

import com.cactus.practice.dto.ApiResponse;
import com.cactus.practice.dto.BalanceSummaryDto;
import com.cactus.practice.dto.PagedResponse;
import com.cactus.practice.dto.PayoutRequest;
import com.cactus.practice.entity.Payout;
import com.cactus.practice.service.PayoutService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payouts")
@Tag(name = "Balances & Payouts", description = "Endpoints for bank payouts, available balances, and instant disbursements")
public class PayoutController {

    private final PayoutService payoutService;

    @Autowired
    public PayoutController(PayoutService payoutService) {
        this.payoutService = payoutService;
    }

    @GetMapping
    @Operation(summary = "Get all payout records")
    public ResponseEntity<ApiResponse<List<Payout>>> getAllPayouts() {
        List<Payout> list = payoutService.getAllPayouts();
        return ResponseEntity.ok(ApiResponse.ok("Payouts retrieved successfully", list));
    }

    @GetMapping("/summary")
    @Operation(summary = "Get balance summary (available to pay out, on the way, total payouts)")
    public ResponseEntity<ApiResponse<BalanceSummaryDto>> getBalanceSummary() {
        BalanceSummaryDto summary = payoutService.getBalanceSummary();
        return ResponseEntity.ok(ApiResponse.ok("Balance summary retrieved successfully", summary));
    }

    @PostMapping
    @Operation(summary = "Execute an instant or standard payout")
    public ResponseEntity<ApiResponse<Payout>> createPayout(@Valid @RequestBody PayoutRequest request) {
        Payout payout = payoutService.createPayout(request);
        return ResponseEntity.ok(ApiResponse.ok("Payout initiated successfully", payout));
    }

    @GetMapping("/filter")
    @Operation(summary = "Filter payouts using Unified HibernateDao")
    public ResponseEntity<ApiResponse<PagedResponse<Payout>>> filterPayouts(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir
    ) {
        PagedResponse<Payout> result = payoutService.filterPayouts(search, page, size, sortBy, sortDir);
        return ResponseEntity.ok(ApiResponse.ok("Filtered payouts retrieved", result));
    }
}
