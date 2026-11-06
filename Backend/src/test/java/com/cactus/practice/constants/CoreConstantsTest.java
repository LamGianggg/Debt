package com.cactus.practice.constants;

import org.junit.jupiter.api.Test;
import java.lang.reflect.Constructor;
import static org.junit.jupiter.api.Assertions.*;

class CoreConstantsTest {

    @Test
    void testPrivateConstructor() throws Exception {
        Constructor<CoreConstants> constructor = CoreConstants.class.getDeclaredConstructor();
        constructor.setAccessible(true);
        CoreConstants instance = constructor.newInstance();
        assertNotNull(instance);
        assertEquals("USD", CoreConstants.CURRENCY_USD);
        assertEquals("yyyy-MM-dd", CoreConstants.DATE_FORMAT);
    }
}
