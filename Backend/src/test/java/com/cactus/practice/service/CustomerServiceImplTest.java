package com.cactus.practice.service;

import com.cactus.practice.HibernateDao.CustomerHibernateDao;
import com.cactus.practice.dto.CustomerRequest;
import com.cactus.practice.dto.PagedResponse;
import com.cactus.practice.entity.Customer;
import com.cactus.practice.exception.ResourceNotFoundException;
import com.cactus.practice.repository.CustomerRepository;
import com.cactus.practice.service.impl.CustomerServiceImpl;
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
class CustomerServiceImplTest {

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private CustomerHibernateDao customerHibernateDao;

    @InjectMocks
    private CustomerServiceImpl customerService;

    @Test
    void testGetAllCustomers() {
        Customer c = new Customer("cus_1", "Hoang Phat", "hp@example.com", "0901234567", "$0.00", "$0.00", 0, "Nov 01, 2026", "Active", "Ha Noi", "Visa •••• 4242");
        when(customerRepository.findAll()).thenReturn(Collections.singletonList(c));

        List<Customer> list = customerService.getAllCustomers();
        assertEquals(1, list.size());
        assertEquals("Hoang Phat", list.get(0).getName());
    }

    @Test
    void testGetCustomerById_Found() {
        Customer c = new Customer("cus_1", "Hoang Phat", "hp@example.com", "0901234567", "$0.00", "$0.00", 0, "Nov 01, 2026", "Active", "Ha Noi", "Visa •••• 4242");
        when(customerRepository.findById("cus_1")).thenReturn(Optional.of(c));

        Customer result = customerService.getCustomerById("cus_1");
        assertNotNull(result);
        assertEquals("cus_1", result.getId());
    }

    @Test
    void testGetCustomerById_NotFound() {
        when(customerRepository.findById("cus_999")).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> customerService.getCustomerById("cus_999"));
    }

    @Test
    void testCreateCustomer() {
        CustomerRequest req = new CustomerRequest("An Binh Group", "ab@example.com", "0912345678", "Da Nang", "Active", "Bank Transfer");
        when(customerRepository.save(any(Customer.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Customer created = customerService.createCustomer(req);
        assertNotNull(created);
        assertEquals("An Binh Group", created.getName());
        assertEquals("ab@example.com", created.getEmail());
        assertTrue(created.getId().startsWith("cus_O"));
    }

    @Test
    void testUpdateCustomer() {
        Customer existing = new Customer("cus_1", "Old Name", "old@example.com", "0900000000", "$0.00", "$0.00", 0, "Nov 01, 2026", "Active", "Ha Noi", "Visa •••• 4242");
        when(customerRepository.findById("cus_1")).thenReturn(Optional.of(existing));
        when(customerRepository.save(any(Customer.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CustomerRequest updateReq = new CustomerRequest("New Name", "new@example.com", "0911111111", "HCM", "Inactive", "Cash");
        Customer updated = customerService.updateCustomer("cus_1", updateReq);

        assertEquals("New Name", updated.getName());
        assertEquals("new@example.com", updated.getEmail());
        assertEquals("Inactive", updated.getStatus());
    }

    @Test
    void testDeleteCustomer_Success() {
        when(customerRepository.existsById("cus_1")).thenReturn(true);
        doNothing().when(customerRepository).deleteById("cus_1");

        assertDoesNotThrow(() -> customerService.deleteCustomer("cus_1"));
        verify(customerRepository, times(1)).deleteById("cus_1");
    }

    @Test
    void testDeleteCustomer_NotFound() {
        when(customerRepository.existsById("cus_999")).thenReturn(false);
        assertThrows(ResourceNotFoundException.class, () -> customerService.deleteCustomer("cus_999"));
    }

    @Test
    void testFilterCustomers() {
        Customer c = new Customer("cus_1", "Hoang Phat", "hp@example.com", "0901234567", "$0.00", "$0.00", 0, "Nov 01, 2026", "Active", "Ha Noi", "Visa •••• 4242");
        Page<Customer> page = new PageImpl<>(Collections.singletonList(c), PageRequest.of(0, 10), 1);
        when(customerHibernateDao.filter("Hoang", 0, 10, "createdAt", "desc")).thenReturn(page);

        PagedResponse<Customer> response = customerService.filterCustomers("Hoang", 0, 10, "createdAt", "desc");
        assertNotNull(response);
        assertEquals(1, response.getContent().size());
        assertEquals(1, response.getTotalElements());
    }
}
