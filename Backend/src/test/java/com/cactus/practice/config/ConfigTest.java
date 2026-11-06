package com.cactus.practice.config;

import io.swagger.v3.oas.models.OpenAPI;
import org.junit.jupiter.api.Test;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import static org.junit.jupiter.api.Assertions.*;

class ConfigTest {

    @Test
    void testOpenApiConfig() {
        OpenApiConfig config = new OpenApiConfig();
        OpenAPI openAPI = config.openAPI();
        assertNotNull(openAPI);
        assertNotNull(openAPI.getInfo());
    }

    @Test
    void testWebMvcConfig() {
        WebMvcConfig config = new WebMvcConfig();
        CorsRegistry registry = new CorsRegistry();
        config.addCorsMappings(registry);
        assertNotNull(config);
    }
}
