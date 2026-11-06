package com.cactus.practice.HibernateDao;

import com.cactus.practice.entity.Payout;
import com.cactus.practice.repository.PayoutRepository;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class PayoutHibernateDao extends HibernateGenericDao<Payout, String> {

    private static final Set<String> ALLOWED_SEARCH = Set.of("id", "status", "destination", "type");
    private static final Set<String> ALLOWED_SORT = Set.of("id", "createdAt", "status", "rawAmount");

    public PayoutHibernateDao(PayoutRepository repository) {
        super(repository, repository, ALLOWED_SEARCH, ALLOWED_SORT, "createdAt");
    }
}
