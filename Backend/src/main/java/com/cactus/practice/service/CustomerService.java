package com.cactus.practice.service;

import com.cactus.practice.dto.CustomerRequest;
import com.cactus.practice.dto.PagedResponse;
import com.cactus.practice.entity.Customer;

import java.util.List;

public interface CustomerService {
    List<Customer> getAllCustomers();
    Customer getCustomerById(String id);
    Customer createCustomer(CustomerRequest request);
    Customer updateCustomer(String id, CustomerRequest request);
    void deleteCustomer(String id);
    PagedResponse<Customer> filterCustomers(String search, int page, int size, String sortBy, String sortDir);
}
