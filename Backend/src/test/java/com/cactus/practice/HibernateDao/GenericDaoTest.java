package com.cactus.practice.HibernateDao;

import com.cactus.practice.entity.*;
import com.cactus.practice.repository.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GenericDaoTest {

    @Mock
    private CustomerRepository customerRepo;

    @Mock
    private TransactionRepository txRepo;

    @Mock
    private PayoutRepository payoutRepo;

    @Mock
    private ConnectedAccountRepository accountRepo;

    @Mock
    private ProductRepository productRepo;

    @Test
    void testCustomerHibernateDao() {
        CustomerHibernateDao dao = new CustomerHibernateDao(customerRepo);
        Customer c = new Customer();
        c.setId("cus_1");

        when(customerRepo.save(c)).thenReturn(c);
        assertEquals(c, dao.save(c));

        when(customerRepo.findById("cus_1")).thenReturn(Optional.of(c));
        assertTrue(dao.findById("cus_1").isPresent());

        when(customerRepo.findAll()).thenReturn(List.of(c));
        assertEquals(1, dao.findAll().size());

        when(customerRepo.existsById("cus_1")).thenReturn(true);
        assertTrue(dao.existsById("cus_1"));

        doNothing().when(customerRepo).deleteById("cus_1");
        assertDoesNotThrow(() -> dao.deleteById("cus_1"));

        when(customerRepo.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(c)));
        Page<Customer> page = dao.filter("name:Hoang", 0, 10, "name", "ASC");
        assertEquals(1, page.getContent().size());
    }

    @Test
    void testTransactionHibernateDao() {
        TransactionHibernateDao dao = new TransactionHibernateDao(txRepo);
        when(txRepo.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(new PageImpl<>(Collections.emptyList()));
        Page<Transaction> page = dao.filter("status:Succeeded", 0, 10, "createdAt", "DESC");
        assertNotNull(page);
    }

    @Test
    void testPayoutHibernateDao() {
        PayoutHibernateDao dao = new PayoutHibernateDao(payoutRepo);
        when(payoutRepo.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(new PageImpl<>(Collections.emptyList()));
        Page<Payout> page = dao.filter("status:Paid", 0, 10, "createdAt", "DESC");
        assertNotNull(page);
    }

    @Test
    void testConnectedAccountHibernateDao() {
        ConnectedAccountHibernateDao dao = new ConnectedAccountHibernateDao(accountRepo);
        when(accountRepo.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(new PageImpl<>(Collections.emptyList()));
        Page<ConnectedAccount> page = dao.filter("name:Hanoi", 0, 10, "name", "ASC");
        assertNotNull(page);
    }

    @Test
    void testProductHibernateDao() {
        ProductHibernateDao dao = new ProductHibernateDao(productRepo);
        when(productRepo.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(new PageImpl<>(Collections.emptyList()));
        Page<Product> page = dao.filter("name:HopDong", 0, 10, "name", "ASC");
        assertNotNull(page);
    }
}
