package com.cactus.practice.rest;

import com.cactus.practice.dto.CustomerRequest;
import com.cactus.practice.entity.Customer;
import com.cactus.practice.exception.GlobalExceptionHandler;
import com.cactus.practice.service.CustomerService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class CustomerControllerTest {

    private MockMvc mockMvc;

    @Mock
    private CustomerService customerService;

    @InjectMocks
    private CustomerController customerController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(customerController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void testGetAllCustomers() throws Exception {
        Customer c = new Customer("cus_1", "Hoang Phat", "hp@example.com", "0901234567", "$0.00", "$0.00", 0, "Nov 01, 2026", "Active", "Ha Noi", "Visa");
        when(customerService.getAllCustomers()).thenReturn(Collections.singletonList(c));

        mockMvc.perform(get("/api/customers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].id").value("cus_1"));
    }

    @Test
    void testGetCustomerById() throws Exception {
        Customer c = new Customer("cus_1", "Hoang Phat", "hp@example.com", "0901234567", "$0.00", "$0.00", 0, "Nov 01, 2026", "Active", "Ha Noi", "Visa");
        when(customerService.getCustomerById("cus_1")).thenReturn(c);

        mockMvc.perform(get("/api/customers/cus_1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Hoang Phat"));
    }

    @Test
    void testCreateCustomer() throws Exception {
        CustomerRequest req = new CustomerRequest("An Binh", "ab@example.com", "0912345678", "Da Nang", "Active", "Bank Transfer");
        Customer created = new Customer("cus_2", "An Binh", "ab@example.com", "0912345678", "$0.00", "$0.00", 0, "Nov 01, 2026", "Active", "Da Nang", "Bank Transfer");

        when(customerService.createCustomer(any(CustomerRequest.class))).thenReturn(created);

        mockMvc.perform(post("/api/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value("cus_2"));
    }

    @Test
    void testUpdateCustomer() throws Exception {
        CustomerRequest req = new CustomerRequest("An Binh New", "abnew@example.com", "0912345678", "Da Nang", "Active", "Bank Transfer");
        Customer updated = new Customer("cus_2", "An Binh New", "abnew@example.com", "0912345678", "$0.00", "$0.00", 0, "Nov 01, 2026", "Active", "Da Nang", "Bank Transfer");

        when(customerService.updateCustomer(eq("cus_2"), any(CustomerRequest.class))).thenReturn(updated);

        mockMvc.perform(put("/api/customers/cus_2")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("An Binh New"));
    }

    @Test
    void testDeleteCustomer() throws Exception {
        doNothing().when(customerService).deleteCustomer("cus_1");

        mockMvc.perform(delete("/api/customers/cus_1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testFilterCustomers() throws Exception {
        Customer c = new Customer("cus_1", "Hoang Phat", "hp@example.com", "0901234567", "$0.00", "$0.00", 0, "Nov 01, 2026", "Active", "Ha Noi", "Visa");
        com.cactus.practice.dto.PagedResponse<Customer> paged = new com.cactus.practice.dto.PagedResponse<>(List.of(c), 0, 10, 1L, 1, true);

        when(customerService.filterCustomers(any(), eq(0), eq(10), any(), any())).thenReturn(paged);

        mockMvc.perform(get("/api/customers/filter"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalElements").value(1));
    }
}
