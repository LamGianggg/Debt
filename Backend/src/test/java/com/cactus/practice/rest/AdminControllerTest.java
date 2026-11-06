package com.cactus.practice.rest;

import com.cactus.practice.entity.RoleType;
import com.cactus.practice.entity.User;
import com.cactus.practice.exception.GlobalExceptionHandler;
import com.cactus.practice.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.*;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class AdminControllerTest {

    private MockMvc mockMvc;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AdminController adminController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(adminController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void testGetAllUsers() throws Exception {
        User u = new User("admin", "pass", "admin@debtmaster.vn");
        u.setId(1L);
        u.setRoles(Collections.singleton(RoleType.ROLE_ADMIN));

        when(userRepository.findAll()).thenReturn(Collections.singletonList(u));

        mockMvc.perform(get("/api/admin/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].username").value("admin"));
    }

    @Test
    void testCreateUser_Success() throws Exception {
        Map<String, Object> req = new HashMap<>();
        req.put("username", "staff_new");
        req.put("email", "staff@debtmaster.vn");
        req.put("password", "123456");
        req.put("roles", Collections.singletonList("ROLE_STAFF"));

        when(userRepository.existsByUsername("staff_new")).thenReturn(false);
        when(userRepository.existsByEmail("staff@debtmaster.vn")).thenReturn(false);
        when(passwordEncoder.encode("123456")).thenReturn("hashed123456");

        User saved = new User("staff_new", "hashed123456", "staff@debtmaster.vn");
        saved.setId(2L);
        saved.setRoles(Collections.singleton(RoleType.ROLE_STAFF));

        when(userRepository.save(any(User.class))).thenReturn(saved);

        mockMvc.perform(post("/api/admin/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.username").value("staff_new"));
    }

    @Test
    void testUpdateUserRoles() throws Exception {
        User u = new User("staff_1", "pass", "staff1@debtmaster.vn");
        u.setId(3L);
        u.setRoles(new HashSet<>(Collections.singleton(RoleType.ROLE_USER)));

        when(userRepository.findById(3L)).thenReturn(Optional.of(u));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Set<String> roles = Collections.singleton("ROLE_ADMIN");

        mockMvc.perform(put("/api/admin/users/3/roles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(roles)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.roles[0]").value("ROLE_ADMIN"));
    }

    @Test
    void testToggleUserStatus() throws Exception {
        User u = new User("staff_1", "pass", "staff1@debtmaster.vn");
        u.setId(3L);
        u.setEnabled(true);

        when(userRepository.findById(3L)).thenReturn(Optional.of(u));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        mockMvc.perform(put("/api/admin/users/3/status")
                        .param("enabled", "false"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.enabled").value(false));
    }
}
