package com.cactus.practice.security;

import com.cactus.practice.security.jwt.CustomAccessDeniedHandler;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.access.AccessDeniedException;

import static org.junit.jupiter.api.Assertions.*;

class CustomAccessDeniedHandlerTest {

    @Test
    void testHandle() throws Exception {
        CustomAccessDeniedHandler handler = new CustomAccessDeniedHandler();
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();

        handler.handle(request, response, new AccessDeniedException("Forbidden action"));

        assertEquals(403, response.getStatus());
        assertTrue(response.getContentAsString().contains("Forbidden: You do not have permission"));
    }
}
