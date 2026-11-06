package com.cactus.practice.config;

import com.cactus.practice.entity.*;
import com.cactus.practice.repository.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DataInitializerTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private SubscriptionRepository subscriptionRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private PayoutRepository payoutRepository;

    @Mock
    private ConnectedAccountRepository connectedAccountRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private DataInitializer dataInitializer;

    @Test
    void testRunWithEmptyDatabase() {
        when(userRepository.existsByUsername("admin")).thenReturn(false);
        when(userRepository.existsByUsername("staff")).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("encodedPassword");

        when(customerRepository.count()).thenReturn(0L);
        when(transactionRepository.count()).thenReturn(0L);
        when(payoutRepository.count()).thenReturn(0L);
        when(connectedAccountRepository.count()).thenReturn(0L);
        when(productRepository.count()).thenReturn(0L);

        assertDoesNotThrow(() -> dataInitializer.run());

        verify(userRepository, atLeastOnce()).save(any(User.class));
        verify(customerRepository, atLeastOnce()).save(any(Customer.class));
        verify(subscriptionRepository, atLeastOnce()).save(any(Subscription.class));
        verify(transactionRepository, atLeastOnce()).save(any(Transaction.class));
        verify(payoutRepository, atLeastOnce()).save(any(Payout.class));
        verify(connectedAccountRepository, atLeastOnce()).save(any(ConnectedAccount.class));
        verify(productRepository, atLeastOnce()).save(any(Product.class));
    }

    @Test
    void testRunWithExistingData() {
        when(userRepository.existsByUsername("admin")).thenReturn(true);
        when(userRepository.existsByUsername("staff")).thenReturn(true);

        when(customerRepository.count()).thenReturn(5L);
        when(transactionRepository.count()).thenReturn(5L);
        when(payoutRepository.count()).thenReturn(5L);
        when(connectedAccountRepository.count()).thenReturn(5L);
        when(productRepository.count()).thenReturn(5L);

        assertDoesNotThrow(() -> dataInitializer.run());
    }
}
