package com.cactus.practice.service;

import com.cactus.practice.dto.PagedResponse;
import com.cactus.practice.dto.ProductRequest;
import com.cactus.practice.entity.Product;

import java.util.List;

public interface ProductService {
    List<Product> getAllProducts();
    Product getProductById(String id);
    Product createProduct(ProductRequest request);
    Product updateProduct(String id, ProductRequest request);
    void deleteProduct(String id);
    PagedResponse<Product> filterProducts(String search, int page, int size, String sortBy, String sortDir);
}
