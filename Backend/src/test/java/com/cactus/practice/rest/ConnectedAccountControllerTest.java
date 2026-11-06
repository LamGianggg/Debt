package com.cactus.practice.rest;

import com.cactus.practice.dto.ConnectedAccountRequest;
import com.cactus.practice.dto.PagedResponse;
import com.cactus.practice.entity.ConnectedAccount;
import com.cactus.practice.exception.GlobalExceptionHandler;
import com.cactus.practice.service.ConnectedAccountService;
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
class ConnectedAccountControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ConnectedAccountService service;

    @InjectMocks
    private ConnectedAccountController controller;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void testGetAllAccounts() throws Exception {
        ConnectedAccount ca = new ConnectedAccount("acct_1", "Branch 1", "Type", "b@test.com", 10, "$1K", "Enabled", "success", "Hanoi", "VCB");
        when(service.getAllAccounts()).thenReturn(List.of(ca));

        mockMvc.perform(get("/api/connected-accounts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].id").value("acct_1"));
    }

    @Test
    void testGetAccountById() throws Exception {
        ConnectedAccount ca = new ConnectedAccount("acct_1", "Branch 1", "Type", "b@test.com", 10, "$1K", "Enabled", "success", "Hanoi", "VCB");
        when(service.getAccountById("acct_1")).thenReturn(ca);

        mockMvc.perform(get("/api/connected-accounts/acct_1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Branch 1"));
    }

    @Test
    void testCreateAccount() throws Exception {
        ConnectedAccountRequest req = new ConnectedAccountRequest("Branch 1", "Type", "b@test.com", "Hanoi", "VCB");
        ConnectedAccount created = new ConnectedAccount("acct_1", "Branch 1", "Type", "b@test.com", 0, "$0", "Enabled", "success", "Hanoi", "VCB");

        when(service.createAccount(any(ConnectedAccountRequest.class))).thenReturn(created);

        mockMvc.perform(post("/api/connected-accounts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value("acct_1"));
    }

    @Test
    void testUpdateAccount() throws Exception {
        ConnectedAccountRequest req = new ConnectedAccountRequest("Branch 2", "Type", "b2@test.com", "Hanoi", "VCB");
        ConnectedAccount updated = new ConnectedAccount("acct_1", "Branch 2", "Type", "b2@test.com", 0, "$0", "Enabled", "success", "Hanoi", "VCB");

        when(service.updateAccount(eq("acct_1"), any(ConnectedAccountRequest.class))).thenReturn(updated);

        mockMvc.perform(put("/api/connected-accounts/acct_1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Branch 2"));
    }

    @Test
    void testDeleteAccount() throws Exception {
        doNothing().when(service).deleteAccount("acct_1");

        mockMvc.perform(delete("/api/connected-accounts/acct_1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testFilterAccounts() throws Exception {
        ConnectedAccount ca = new ConnectedAccount("acct_1", "Branch 1", "Type", "b@test.com", 10, "$1K", "Enabled", "success", "Hanoi", "VCB");
        PagedResponse<ConnectedAccount> paged = new PagedResponse<>(List.of(ca), 0, 10, 1L, 1, true);

        when(service.filterAccounts(any(), eq(0), eq(10), any(), any())).thenReturn(paged);

        mockMvc.perform(get("/api/connected-accounts/filter"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalElements").value(1));
    }
}
