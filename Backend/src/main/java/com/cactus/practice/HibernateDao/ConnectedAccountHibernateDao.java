package com.cactus.practice.HibernateDao;

import com.cactus.practice.entity.ConnectedAccount;
import com.cactus.practice.repository.ConnectedAccountRepository;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class ConnectedAccountHibernateDao extends HibernateGenericDao<ConnectedAccount, String> {

    private static final Set<String> ALLOWED_SEARCH = Set.of("id", "name", "type", "email", "status", "location");
    private static final Set<String> ALLOWED_SORT = Set.of("id", "name", "patients", "status");

    public ConnectedAccountHibernateDao(ConnectedAccountRepository repository) {
        super(repository, repository, ALLOWED_SEARCH, ALLOWED_SORT, "name");
    }
}
