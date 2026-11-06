package com.cactus.practice.HibernateDao;

import com.cactus.practice.entity.Transaction;
import com.cactus.practice.repository.TransactionRepository;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class TransactionHibernateDao extends HibernateGenericDao<Transaction, String> {

    private static final Set<String> ALLOWED_SEARCH = Set.of("id", "customer", "customerEmail", "status", "statusType", "method", "description");
    private static final Set<String> ALLOWED_SORT = Set.of("id", "createdAt", "customer", "status", "rawAmount");

    public TransactionHibernateDao(TransactionRepository repository) {
        super(repository, repository, ALLOWED_SEARCH, ALLOWED_SORT, "createdAt");
    }
}
