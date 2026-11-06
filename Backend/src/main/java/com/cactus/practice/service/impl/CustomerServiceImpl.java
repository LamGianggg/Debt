package com.cactus.practice.service.impl;

import com.cactus.practice.HibernateDao.CustomerHibernateDao;
import com.cactus.practice.dto.CustomerRequest;
import com.cactus.practice.dto.PagedResponse;
import com.cactus.practice.entity.Customer;
import com.cactus.practice.exception.ResourceNotFoundException;
import com.cactus.practice.repository.CustomerRepository;
import com.cactus.practice.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerHibernateDao customerHibernateDao;

    @Autowired
    public CustomerServiceImpl(CustomerRepository customerRepository, CustomerHibernateDao customerHibernateDao) {
        this.customerRepository = customerRepository;
        this.customerHibernateDao = customerHibernateDao;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Customer getCustomerById(String id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
    }

    @Override
    public Customer createCustomer(CustomerRequest request) {
        String id = "cus_O" + UUID.randomUUID().toString().replace("-", "").substring(0, 9);
        String createdDate = LocalDate.now().format(DateTimeFormatter.ofPattern("MMM dd, yyyy"));

        Customer customer = new Customer(
                id,
                request.getName(),
                request.getEmail(),
                request.getPhone() != null ? request.getPhone() : "+1 (555) 000-0000",
                "$0.00 USD",
                "$0.00 USD",
                0,
                createdDate,
                request.getStatus() != null ? request.getStatus() : "Active",
                request.getAddress() != null ? request.getAddress() : "Unspecified address",
                request.getDefaultPayment() != null ? request.getDefaultPayment() : "No payment method added"
        );

        return customerRepository.save(customer);
    }

    @Override
    public Customer updateCustomer(String id, CustomerRequest request) {
        Customer existing = getCustomerById(id);
        if (request.getName() != null) existing.setName(request.getName());
        if (request.getEmail() != null) existing.setEmail(request.getEmail());
        if (request.getPhone() != null) existing.setPhone(request.getPhone());
        if (request.getAddress() != null) existing.setAddress(request.getAddress());
        if (request.getStatus() != null) existing.setStatus(request.getStatus());
        if (request.getDefaultPayment() != null) existing.setDefaultPayment(request.getDefaultPayment());

        return customerRepository.save(existing);
    }

    @Override
    public void deleteCustomer(String id) {
        if (!customerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Customer not found with id: " + id);
        }
        customerRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<Customer> filterCustomers(String search, int page, int size, String sortBy, String sortDir) {
        Page<Customer> pagedResult = customerHibernateDao.filter(search, page, size, sortBy, sortDir);
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
