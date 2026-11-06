package com.cactus.practice.service;

import com.cactus.practice.HibernateDao.ConnectedAccountHibernateDao;
import com.cactus.practice.dto.ConnectedAccountRequest;
import com.cactus.practice.dto.PagedResponse;
import com.cactus.practice.entity.ConnectedAccount;
import com.cactus.practice.exception.ResourceNotFoundException;
import com.cactus.practice.repository.ConnectedAccountRepository;
import com.cactus.practice.service.impl.ConnectedAccountServiceImpl;
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
class ConnectedAccountServiceImplTest {

    @Mock
    private ConnectedAccountRepository repository;

    @Mock
    private ConnectedAccountHibernateDao hibernateDao;

    @InjectMocks
    private ConnectedAccountServiceImpl service;

    @Test
    void testGetAllConnectedAccounts() {
        ConnectedAccount acc = new ConnectedAccount("acct_1", "Chi nhanh Ha Noi", "Chi nhanh noi bo", "hn@debtmaster.vn", 20, "$50,000.00 USD", "Enabled", "success", "Ha Noi", "Vietcombank");
        when(repository.findAll()).thenReturn(Collections.singletonList(acc));

        List<ConnectedAccount> list = service.getAllAccounts();
        assertEquals(1, list.size());
        assertEquals("acct_1", list.get(0).getId());
    }

    @Test
    void testGetConnectedAccountById_Found() {
        ConnectedAccount acc = new ConnectedAccount("acct_1", "Chi nhanh Ha Noi", "Chi nhanh noi bo", "hn@debtmaster.vn", 20, "$50,000.00 USD", "Enabled", "success", "Ha Noi", "Vietcombank");
        when(repository.findById("acct_1")).thenReturn(Optional.of(acc));

        ConnectedAccount result = service.getAccountById("acct_1");
        assertNotNull(result);
        assertEquals("acct_1", result.getId());
    }

    @Test
    void testGetConnectedAccountById_NotFound() {
        when(repository.findById("acct_999")).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> service.getAccountById("acct_999"));
    }

    @Test
    void testCreateConnectedAccount() {
        ConnectedAccountRequest req = new ConnectedAccountRequest("Chi nhanh HCM", "Dai ly thu ho", "hcm@debtmaster.vn", "TP.HCM", "Techcombank");
        when(repository.save(any(ConnectedAccount.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ConnectedAccount created = service.createAccount(req);
        assertNotNull(created);
        assertEquals("Chi nhanh HCM", created.getName());
        assertEquals("Enabled", created.getStatus());
    }

    @Test
    void testUpdateConnectedAccount() {
        ConnectedAccount existing = new ConnectedAccount("acct_1", "Old Name", "Old Type", "old@debtmaster.vn", 10, "$10,000.00 USD", "Enabled", "success", "Ha Noi", "Vietcombank");
        when(repository.findById("acct_1")).thenReturn(Optional.of(existing));
        when(repository.save(any(ConnectedAccount.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ConnectedAccountRequest req = new ConnectedAccountRequest("New Name", "New Type", "new@debtmaster.vn", "Da Nang", "BIDV");
        ConnectedAccount updated = service.updateAccount("acct_1", req);

        assertEquals("New Name", updated.getName());
        assertEquals("Da Nang", updated.getLocation());
    }

    @Test
    void testFilterConnectedAccounts() {
        ConnectedAccount acc = new ConnectedAccount("acct_1", "Chi nhanh Ha Noi", "Chi nhanh noi bo", "hn@debtmaster.vn", 20, "$50,000.00 USD", "Enabled", "success", "Ha Noi", "Vietcombank");
        Page<ConnectedAccount> page = new PageImpl<>(Collections.singletonList(acc), PageRequest.of(0, 10), 1);
        when(hibernateDao.filter("Ha Noi", 0, 10, "createdAt", "desc")).thenReturn(page);

        PagedResponse<ConnectedAccount> response = service.filterAccounts("Ha Noi", 0, 10, "createdAt", "desc");
        assertNotNull(response);
        assertEquals(1, response.getContent().size());
    }
}
