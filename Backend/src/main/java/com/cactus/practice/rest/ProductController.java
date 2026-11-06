package com.cactus.practice.rest;

import com.cactus.practice.dto.ApiResponse;
import com.cactus.practice.dto.PagedResponse;
import com.cactus.practice.dto.ProductRequest;
import com.cactus.practice.entity.Product;
import com.cactus.practice.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@Tag(name = "Products & Pricing Catalog", description = "Endpoints for consultation fees, lab packages, and recurring care memberships")
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    @Operation(summary = "Get all products in catalog")
    public ResponseEntity<ApiResponse<List<Product>>> getAllProducts() {
        List<Product> list = productService.getAllProducts();
        return ResponseEntity.ok(ApiResponse.ok("Products retrieved successfully", list));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID")
    public ResponseEntity<ApiResponse<Product>> getProductById(@PathVariable String id) {
        Product product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.ok("Product retrieved successfully", product));
    }

    @PostMapping
    @Operation(summary = "Add new product / pricing plan")
    public ResponseEntity<ApiResponse<Product>> createProduct(@Valid @RequestBody ProductRequest request) {
        Product created = productService.createProduct(request);
        return ResponseEntity.ok(ApiResponse.ok("Product added successfully", created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update product details")
    public ResponseEntity<ApiResponse<Product>> updateProduct(@PathVariable String id, @Valid @RequestBody ProductRequest request) {
        Product updated = productService.updateProduct(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Product updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete / archive product")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.ok("Product deleted successfully", null));
    }

    @GetMapping("/filter")
    @Operation(summary = "Filter products using Unified HibernateDao")
    public ResponseEntity<ApiResponse<PagedResponse<Product>>> filterProducts(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDir
    ) {
        PagedResponse<Product> result = productService.filterProducts(search, page, size, sortBy, sortDir);
        return ResponseEntity.ok(ApiResponse.ok("Filtered products retrieved", result));
    }
}
