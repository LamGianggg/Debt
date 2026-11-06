package com.cactus.practice.rest;

import com.cactus.practice.dto.ApiResponse;
import com.cactus.practice.dto.CustomerRequest;
import com.cactus.practice.dto.PagedResponse;
import com.cactus.practice.entity.Customer;
import com.cactus.practice.service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@Tag(name = "Customers & Patients", description = "Endpoints for managing registered patients, billing accounts, and care memberships")
public class CustomerController {

    private final CustomerService customerService;

    @Autowired
    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    @Operation(summary = "Get all customers")
    public ResponseEntity<ApiResponse<List<Customer>>> getAllCustomers() {
        List<Customer> list = customerService.getAllCustomers();
        return ResponseEntity.ok(ApiResponse.ok("Customers retrieved successfully", list));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get customer details by ID")
    public ResponseEntity<ApiResponse<Customer>> getCustomerById(@PathVariable String id) {
        Customer customer = customerService.getCustomerById(id);
        return ResponseEntity.ok(ApiResponse.ok("Customer retrieved successfully", customer));
    }

    @PostMapping
    @Operation(summary = "Create a new customer profile")
    public ResponseEntity<ApiResponse<Customer>> createCustomer(@Valid @RequestBody CustomerRequest request) {
        Customer created = customerService.createCustomer(request);
        return ResponseEntity.ok(ApiResponse.ok("Customer created successfully", created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update customer profile")
    public ResponseEntity<ApiResponse<Customer>> updateCustomer(@PathVariable String id, @Valid @RequestBody CustomerRequest request) {
        Customer updated = customerService.updateCustomer(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Customer updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete customer profile")
    public ResponseEntity<ApiResponse<Void>> deleteCustomer(@PathVariable String id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok(ApiResponse.ok("Customer deleted successfully", null));
    }

    @GetMapping("/filter")
    @Operation(summary = "Filter customers using Unified HibernateDao")
    public ResponseEntity<ApiResponse<PagedResponse<Customer>>> filterCustomers(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDir
    ) {
        PagedResponse<Customer> result = customerService.filterCustomers(search, page, size, sortBy, sortDir);
        return ResponseEntity.ok(ApiResponse.ok("Filtered customers retrieved", result));
    }
}
