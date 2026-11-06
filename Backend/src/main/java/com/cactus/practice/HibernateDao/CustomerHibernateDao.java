package com.cactus.practice.HibernateDao;

import com.cactus.practice.entity.Customer;
import com.cactus.practice.repository.CustomerRepository;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class CustomerHibernateDao extends HibernateGenericDao<Customer, String> {

    private static final Set<String> ALLOWED_SEARCH = Set.of("id", "name", "email", "phone", "status", "address");
    private static final Set<String> ALLOWED_SORT = Set.of("id", "name", "email", "created", "status", "paymentsCount");

    public CustomerHibernateDao(CustomerRepository repository) {
        super(repository, repository, ALLOWED_SEARCH, ALLOWED_SORT, "name");
    }
}
