package com.cactus.practice.security;

import com.cactus.practice.entity.RoleType;
import com.cactus.practice.entity.User;
import com.cactus.practice.security.service.UserDetailsImpl;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

class UserDetailsImplTest {

    @Test
    void testUserDetailsImplMethods() {
        User user = new User("debt_admin", "hashed_pass", "admin@debtmaster.vn", Collections.singleton(RoleType.ROLE_ADMIN));
        user.setId(99L);
        UserDetailsImpl details = UserDetailsImpl.build(user);

        assertEquals(99L, details.getId());
        assertEquals("debt_admin", details.getUsername());
        assertEquals("admin@debtmaster.vn", details.getEmail());
        assertEquals("hashed_pass", details.getPassword());
        assertTrue(details.isAccountNonExpired());
        assertTrue(details.isAccountNonLocked());
        assertTrue(details.isCredentialsNonExpired());
        assertTrue(details.isEnabled());
        assertEquals(1, details.getAuthorities().size());

        UserDetailsImpl same = new UserDetailsImpl(99L, "debt_admin", "admin@debtmaster.vn", "hashed_pass", true,
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN")));
        assertEquals(details, same);
        assertEquals(details.hashCode(), same.hashCode());

        UserDetailsImpl different = new UserDetailsImpl(100L, "other", "other@debtmaster.vn", "pass", true,
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));
        assertNotEquals(details, different);
        assertNotEquals(details, null);
    }
}
