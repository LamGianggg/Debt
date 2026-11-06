package com.cactus.practice.rest;

import com.cactus.practice.dto.PagedResponse;
import com.cactus.practice.dto.ProductRequest;
import com.cactus.practice.entity.Product;
import com.cactus.practice.exception.GlobalExceptionHandler;
import com.cactus.practice.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class ProductControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ProductService productService;

    @InjectMocks
    private ProductController controller;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void testGetAllProducts() throws Exception {
        Product p = new Product("prod_1", "Plan A", "Desc", "$100", "Monthly", 10, "Active", "Nov 01");
        when(productService.getAllProducts()).thenReturn(List.of(p));

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].id").value("prod_1"));
    }

    @Test
    void testGetProductById() throws Exception {
        Product p = new Product("prod_1", "Plan A", "Desc", "$100", "Monthly", 10, "Active", "Nov 01");
        when(productService.getProductById("prod_1")).thenReturn(p);

        mockMvc.perform(get("/api/products/prod_1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Plan A"));
    }

    @Test
    void testCreateProduct() throws Exception {
        ProductRequest req = new ProductRequest("Plan A", "Desc", "100", "Monthly");
        Product created = new Product("prod_1", "Plan A", "Desc", "$100", "Monthly", 0, "Active", "Nov 01");

        when(productService.createProduct(any(ProductRequest.class))).thenReturn(created);

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value("prod_1"));
    }

    @Test
    void testUpdateProduct() throws Exception {
        ProductRequest req = new ProductRequest("Plan B", "Desc", "150", "Monthly");
        Product updated = new Product("prod_1", "Plan B", "Desc", "$150", "Monthly", 0, "Active", "Nov 01");

        when(productService.updateProduct(eq("prod_1"), any(ProductRequest.class))).thenReturn(updated);

        mockMvc.perform(put("/api/products/prod_1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Plan B"));
    }

    @Test
    void testDeleteProduct() throws Exception {
        doNothing().when(productService).deleteProduct("prod_1");

        mockMvc.perform(delete("/api/products/prod_1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testFilterProducts() throws Exception {
        Product p = new Product("prod_1", "Plan A", "Desc", "$100", "Monthly", 10, "Active", "Nov 01");
        PagedResponse<Product> paged = new PagedResponse<>(List.of(p), 0, 10, 1L, 1, true);

        when(productService.filterProducts(any(), eq(0), eq(10), any(), any())).thenReturn(paged);

        mockMvc.perform(get("/api/products/filter"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalElements").value(1));
    }
}
