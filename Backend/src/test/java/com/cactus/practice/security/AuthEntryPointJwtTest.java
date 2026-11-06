package com.cactus.practice.security;

import com.cactus.practice.security.jwt.AuthEntryPointJwt;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.AuthenticationException;

import static org.junit.jupiter.api.Assertions.*;

class AuthEntryPointJwtTest {

    @Test
    void testCommence() throws Exception {
        AuthEntryPointJwt entryPoint = new AuthEntryPointJwt();
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();

        entryPoint.commence(request, response, new AuthenticationException("Bad credentials") {});

        assertEquals(401, response.getStatus());
        assertTrue(response.getContentAsString().contains("Unauthorized: Bad credentials"));
    }
}
