package com.cactus.practice.service.impl;

import com.cactus.practice.HibernateDao.ConnectedAccountHibernateDao;
import com.cactus.practice.dto.ConnectedAccountRequest;
import com.cactus.practice.dto.PagedResponse;
import com.cactus.practice.entity.ConnectedAccount;
import com.cactus.practice.exception.ResourceNotFoundException;
import com.cactus.practice.repository.ConnectedAccountRepository;
import com.cactus.practice.service.ConnectedAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ConnectedAccountServiceImpl implements ConnectedAccountService {

    private final ConnectedAccountRepository repository;
    private final ConnectedAccountHibernateDao hibernateDao;

    @Autowired
    public ConnectedAccountServiceImpl(ConnectedAccountRepository repository, ConnectedAccountHibernateDao hibernateDao) {
        this.repository = repository;
        this.hibernateDao = hibernateDao;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ConnectedAccount> getAllAccounts() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public ConnectedAccount getAccountById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Connected account not found with id: " + id));
    }

    @Override
    public ConnectedAccount createAccount(ConnectedAccountRequest request) {
        String id = "acct_" + UUID.randomUUID().toString().replace("-", "").substring(0, 7);
        ConnectedAccount account = new ConnectedAccount(
                id,
                request.getName(),
                request.getType() != null ? request.getType() : "Custom Clinic",
                request.getEmail(),
                0,
                "$0.00 USD",
                "Enabled",
                "success",
                request.getLocation() != null ? request.getLocation() : "United States",
                request.getPayoutBank() != null ? request.getPayoutBank() : "Chase Bank •••• 1209"
        );
        return repository.save(account);
    }

    @Override
    public ConnectedAccount updateAccount(String id, ConnectedAccountRequest request) {
        ConnectedAccount existing = getAccountById(id);
        if (request.getName() != null) existing.setName(request.getName());
        if (request.getEmail() != null) existing.setEmail(request.getEmail());
        if (request.getType() != null) existing.setType(request.getType());
        if (request.getLocation() != null) existing.setLocation(request.getLocation());
        if (request.getPayoutBank() != null) existing.setPayoutBank(request.getPayoutBank());
        return repository.save(existing);
    }

    @Override
    public void deleteAccount(String id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Connected account not found with id: " + id);
        }
        repository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<ConnectedAccount> filterAccounts(String search, int page, int size, String sortBy, String sortDir) {
        Page<ConnectedAccount> pagedResult = hibernateDao.filter(search, page, size, sortBy, sortDir);
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
