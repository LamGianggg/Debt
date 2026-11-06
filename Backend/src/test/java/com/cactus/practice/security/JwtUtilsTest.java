package com.cactus.practice.security;

import com.cactus.practice.entity.RoleType;
import com.cactus.practice.entity.User;
import com.cactus.practice.security.jwt.JwtUtils;
import com.cactus.practice.security.service.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilsTest {

    private JwtUtils jwtUtils;

    @BeforeEach
    void setUp() {
        jwtUtils = new JwtUtils();
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", "cactusPracticeSuperSecretJwtKey2026SecureKeyWithSufficientLengthForHS512Algorithm!");
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 86400000);
    }

    @Test
    void testGenerateAndValidateJwtToken() {
        User user = new User("admin", "123456", "admin@debtmaster.vn", Collections.singleton(RoleType.ROLE_ADMIN));
        user.setId(1L);
        UserDetailsImpl userDetails = UserDetailsImpl.build(user);

        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        String token = jwtUtils.generateJwtToken(auth);

        assertNotNull(token);
        assertTrue(jwtUtils.validateJwtToken(token));
        assertEquals("admin", jwtUtils.getUserNameFromJwtToken(token));
    }

    @Test
    void testValidateInvalidJwtToken() {
        assertFalse(jwtUtils.validateJwtToken("invalid.token.structure"));
        assertFalse(jwtUtils.validateJwtToken(""));
    }
}
