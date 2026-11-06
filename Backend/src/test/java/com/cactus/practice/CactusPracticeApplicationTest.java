package com.cactus.practice;

import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CactusPracticeApplicationTest {

    @Test
    void testApplicationInstantiation() {
        CactusPracticeApplication app = new CactusPracticeApplication();
        assertNotNull(app);
    }

    @Test
    void testMainMethod() {
        try (MockedStatic<org.springframework.boot.SpringApplication> springApp = mockStatic(org.springframework.boot.SpringApplication.class)) {
            springApp.when(() -> org.springframework.boot.SpringApplication.run(eq(CactusPracticeApplication.class), any(String[].class)))
                    .thenReturn(null);

            CactusPracticeApplication.main(new String[]{});
            springApp.verify(() -> org.springframework.boot.SpringApplication.run(eq(CactusPracticeApplication.class), any(String[].class)));
        }
    }
}
