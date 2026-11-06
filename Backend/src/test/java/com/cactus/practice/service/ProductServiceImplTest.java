package com.cactus.practice.service;

import com.cactus.practice.HibernateDao.ProductHibernateDao;
import com.cactus.practice.dto.PagedResponse;
import com.cactus.practice.dto.ProductRequest;
import com.cactus.practice.entity.Product;
import com.cactus.practice.exception.ResourceNotFoundException;
import com.cactus.practice.repository.ProductRepository;
import com.cactus.practice.service.impl.ProductServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceImplTest {

    @Mock
    private ProductRepository repository;

    @Mock
    private ProductHibernateDao hibernateDao;

    @InjectMocks
    private ProductServiceImpl productService;

    @Test
    void testGetAllProducts() {
        Product p = new Product("prod_1", "Goi hop dong no 12 thang", "Mo ta", "$990.00 USD / mo", "Recurring (Monthly)", 10, "Active", "Nov 01, 2026");
        when(repository.findAll()).thenReturn(Collections.singletonList(p));

        List<Product> list = productService.getAllProducts();
        assertEquals(1, list.size());
        assertEquals("prod_1", list.get(0).getId());
    }

    @Test
    void testGetProductById_Found() {
        Product p = new Product("prod_1", "Goi hop dong no 12 thang", "Mo ta", "$990.00 USD / mo", "Recurring (Monthly)", 10, "Active", "Nov 01, 2026");
        when(repository.findById("prod_1")).thenReturn(Optional.of(p));

        Product result = productService.getProductById("prod_1");
        assertNotNull(result);
        assertEquals("prod_1", result.getId());
    }

    @Test
    void testGetProductById_NotFound() {
        when(repository.findById("prod_999")).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> productService.getProductById("prod_999"));
    }

    @Test
    void testCreateProduct() {
        ProductRequest req = new ProductRequest("Goi hop dong no", "Mo ta chi tiet", "1000", "Recurring (Monthly)");
        when(repository.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Product created = productService.createProduct(req);
        assertNotNull(created);
        assertEquals("Goi hop dong no", created.getName());
        assertTrue(created.getPrice().contains("/ mo"));
    }

    @Test
    void testUpdateProduct() {
        Product p = new Product("prod_1", "Old Name", "Old Desc", "$500.00", "One-time", 5, "Active", "Nov 01, 2026");
        when(repository.findById("prod_1")).thenReturn(Optional.of(p));
        when(repository.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ProductRequest req = new ProductRequest("New Name", "New Desc", "800", "One-time");
        Product updated = productService.updateProduct("prod_1", req);

        assertEquals("New Name", updated.getName());
        assertEquals("New Desc", updated.getDescription());
    }

    @Test
    void testDeleteProduct_Success() {
        when(repository.existsById("prod_1")).thenReturn(true);
        doNothing().when(repository).deleteById("prod_1");

        assertDoesNotThrow(() -> productService.deleteProduct("prod_1"));
        verify(repository, times(1)).deleteById("prod_1");
    }

    @Test
    void testDeleteProduct_NotFound() {
        when(repository.existsById("prod_999")).thenReturn(false);
        assertThrows(ResourceNotFoundException.class, () -> productService.deleteProduct("prod_999"));
    }

    @Test
    void testFilterProducts() {
        Product p = new Product("prod_1", "Goi hop dong no 12 thang", "Mo ta", "$990.00 USD / mo", "Recurring (Monthly)", 10, "Active", "Nov 01, 2026");
        Page<Product> page = new PageImpl<>(Collections.singletonList(p), PageRequest.of(0, 10), 1);
        when(hibernateDao.filter("hop dong", 0, 10, "createdAt", "desc")).thenReturn(page);

        PagedResponse<Product> response = productService.filterProducts("hop dong", 0, 10, "createdAt", "desc");
        assertNotNull(response);
        assertEquals(1, response.getContent().size());
    }
}
