package com.cactus.practice.HibernateDao;

import com.cactus.practice.entity.Product;
import com.cactus.practice.repository.ProductRepository;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class ProductHibernateDao extends HibernateGenericDao<Product, String> {

    private static final Set<String> ALLOWED_SEARCH = Set.of("id", "name", "description", "status", "billing");
    private static final Set<String> ALLOWED_SORT = Set.of("id", "name", "activeSubscribers", "status");

    public ProductHibernateDao(ProductRepository repository) {
        super(repository, repository, ALLOWED_SEARCH, ALLOWED_SORT, "name");
    }
}
