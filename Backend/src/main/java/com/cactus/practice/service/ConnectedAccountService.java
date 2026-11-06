package com.cactus.practice.service;

import com.cactus.practice.dto.ConnectedAccountRequest;
import com.cactus.practice.dto.PagedResponse;
import com.cactus.practice.entity.ConnectedAccount;

import java.util.List;

public interface ConnectedAccountService {
    List<ConnectedAccount> getAllAccounts();
    ConnectedAccount getAccountById(String id);
    ConnectedAccount createAccount(ConnectedAccountRequest request);
    ConnectedAccount updateAccount(String id, ConnectedAccountRequest request);
    void deleteAccount(String id);
    PagedResponse<ConnectedAccount> filterAccounts(String search, int page, int size, String sortBy, String sortDir);
}
