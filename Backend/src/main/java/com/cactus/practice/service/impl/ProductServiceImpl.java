package com.cactus.practice.service.impl;

import com.cactus.practice.HibernateDao.ProductHibernateDao;
import com.cactus.practice.dto.PagedResponse;
import com.cactus.practice.dto.ProductRequest;
import com.cactus.practice.entity.Product;
import com.cactus.practice.exception.ResourceNotFoundException;
import com.cactus.practice.repository.ProductRepository;
import com.cactus.practice.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository repository;
    private final ProductHibernateDao hibernateDao;

    @Autowired
    public ProductServiceImpl(ProductRepository repository, ProductHibernateDao hibernateDao) {
        this.repository = repository;
        this.hibernateDao = hibernateDao;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> getAllProducts() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Product getProductById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    @Override
    public Product createProduct(ProductRequest request) {
        String id = "prod_" + UUID.randomUUID().toString().replace("-", "").substring(0, 5);
        String created = LocalDate.now().format(DateTimeFormatter.ofPattern("MMM dd, yyyy"));

        String formattedPrice = request.getPrice().startsWith("$") ? request.getPrice() : "$" + request.getPrice() + " USD";
        if (request.getBilling() != null && request.getBilling().toLowerCase().contains("month") && !formattedPrice.contains("/ mo")) {
            formattedPrice += " / mo";
        } else if (request.getBilling() != null && request.getBilling().toLowerCase().contains("year") && !formattedPrice.contains("/ yr")) {
            formattedPrice += " / yr";
        }

        Product product = new Product(
                id,
                request.getName(),
                request.getDescription(),
                formattedPrice,
                request.getBilling() != null ? request.getBilling() : "Recurring (Monthly)",
                0,
                "Active",
                created
        );
        return repository.save(product);
    }

    @Override
    public Product updateProduct(String id, ProductRequest request) {
        Product existing = getProductById(id);
        if (request.getName() != null) existing.setName(request.getName());
        if (request.getDescription() != null) existing.setDescription(request.getDescription());
        if (request.getPrice() != null) existing.setPrice(request.getPrice());
        if (request.getBilling() != null) existing.setBilling(request.getBilling());
        return repository.save(existing);
    }

    @Override
    public void deleteProduct(String id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        repository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<Product> filterProducts(String search, int page, int size, String sortBy, String sortDir) {
        Page<Product> pagedResult = hibernateDao.filter(search, page, size, sortBy, sortDir);
        return new PagedResponse<>(
                pagedResult.getContent(),
                pagedResult.getNumber(),
                pagedResult.getSize(),
                pagedResult.getTotalElements(),
                pagedResult.getTotalPages(),
                pagedResult.isLast()
        );
    }
}
