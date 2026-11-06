package com.cactus.practice.rest;

import com.cactus.practice.dto.ApiResponse;
import com.cactus.practice.dto.ConnectedAccountRequest;
import com.cactus.practice.dto.PagedResponse;
import com.cactus.practice.entity.ConnectedAccount;
import com.cactus.practice.service.ConnectedAccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/connected-accounts")
@Tag(name = "Connected Accounts", description = "Endpoints for partner clinics, branch practices, and medical revenue sharing")
public class ConnectedAccountController {

    private final ConnectedAccountService service;

    @Autowired
    public ConnectedAccountController(ConnectedAccountService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "Get all connected accounts")
    public ResponseEntity<ApiResponse<List<ConnectedAccount>>> getAllAccounts() {
        List<ConnectedAccount> list = service.getAllAccounts();
        return ResponseEntity.ok(ApiResponse.ok("Connected accounts retrieved successfully", list));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get connected account by ID")
    public ResponseEntity<ApiResponse<ConnectedAccount>> getAccountById(@PathVariable String id) {
        ConnectedAccount account = service.getAccountById(id);
        return ResponseEntity.ok(ApiResponse.ok("Connected account retrieved successfully", account));
    }

    @PostMapping
    @Operation(summary = "Connect a new clinic or partner account")
    public ResponseEntity<ApiResponse<ConnectedAccount>> createAccount(@Valid @RequestBody ConnectedAccountRequest request) {
        ConnectedAccount created = service.createAccount(request);
        return ResponseEntity.ok(ApiResponse.ok("Clinic connected successfully", created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update connected account")
    public ResponseEntity<ApiResponse<ConnectedAccount>> updateAccount(@PathVariable String id, @Valid @RequestBody ConnectedAccountRequest request) {
        ConnectedAccount updated = service.updateAccount(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Connected account updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Disconnect / delete account")
    public ResponseEntity<ApiResponse<Void>> deleteAccount(@PathVariable String id) {
        service.deleteAccount(id);
        return ResponseEntity.ok(ApiResponse.ok("Connected account deleted successfully", null));
    }

    @GetMapping("/filter")
    @Operation(summary = "Filter connected accounts using Unified HibernateDao")
    public ResponseEntity<ApiResponse<PagedResponse<ConnectedAccount>>> filterAccounts(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDir
    ) {
        PagedResponse<ConnectedAccount> result = service.filterAccounts(search, page, size, sortBy, sortDir);
        return ResponseEntity.ok(ApiResponse.ok("Filtered accounts retrieved", result));
    }
}
