package com.cactus.practice.security;

import com.cactus.practice.security.jwt.AuthEntryPointJwt;
import com.cactus.practice.security.jwt.AuthTokenFilter;
import com.cactus.practice.security.jwt.CustomAccessDeniedHandler;
import com.cactus.practice.security.service.UserDetailsServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfigurationSource;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WebSecurityConfigTest {

    @Mock
    private UserDetailsServiceImpl userDetailsService;

    @Mock
    private AuthEntryPointJwt unauthorizedHandler;

    @Mock
    private CustomAccessDeniedHandler accessDeniedHandler;

    @Mock
    private AuthTokenFilter authTokenFilter;

    @Mock
    private AuthenticationConfiguration authConfig;

    @Mock
    private AuthenticationManager authManager;

    private WebSecurityConfig webSecurityConfig;

    @BeforeEach
    void setUp() {
        webSecurityConfig = new WebSecurityConfig(
                userDetailsService,
                unauthorizedHandler,
                accessDeniedHandler,
                authTokenFilter
        );
    }

    @Test
    void testPasswordEncoder() {
        PasswordEncoder encoder = webSecurityConfig.passwordEncoder();
        assertNotNull(encoder);
        String encoded = encoder.encode("password123");
        assertTrue(encoder.matches("password123", encoded));
    }

    @Test
    void testAuthenticationProvider() {
        DaoAuthenticationProvider provider = webSecurityConfig.authenticationProvider();
        assertNotNull(provider);
    }

    @Test
    void testAuthenticationManager() throws Exception {
        when(authConfig.getAuthenticationManager()).thenReturn(authManager);
        AuthenticationManager manager = webSecurityConfig.authenticationManager(authConfig);
        assertEquals(authManager, manager);
    }

    @Test
    void testCorsConfigurationSource() {
        CorsConfigurationSource source = webSecurityConfig.corsConfigurationSource();
        assertNotNull(source);
    }
}
