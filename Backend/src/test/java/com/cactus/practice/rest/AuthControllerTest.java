package com.cactus.practice.rest;

import com.cactus.practice.dto.LoginRequest;
import com.cactus.practice.dto.RegisterRequest;
import com.cactus.practice.entity.RoleType;
import com.cactus.practice.entity.User;
import com.cactus.practice.exception.GlobalExceptionHandler;
import com.cactus.practice.repository.UserRepository;
import com.cactus.practice.security.jwt.JwtUtils;
import com.cactus.practice.security.service.UserDetailsImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder encoder;

    @Mock
    private JwtUtils jwtUtils;

    @InjectMocks
    private AuthController authController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(authController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void testLogin_Success() throws Exception {
        LoginRequest req = new LoginRequest("admin", "123456");

        User user = new User("admin", "123456", "admin@debtmaster.vn", Collections.singleton(RoleType.ROLE_ADMIN));
        user.setId(1L);
        UserDetailsImpl principal = UserDetailsImpl.build(user);

        Authentication auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

        when(authenticationManager.authenticate(any())).thenReturn(auth);
        when(jwtUtils.generateJwtToken(auth)).thenReturn("mocked.jwt.token");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").value("mocked.jwt.token"))
                .andExpect(jsonPath("$.data.username").value("admin"));
    }

    @Test
    void testRegister_Success() throws Exception {
        RegisterRequest req = new RegisterRequest("newuser", "newuser@debtmaster.vn", "123456", Collections.singleton("user"));

        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("newuser@debtmaster.vn")).thenReturn(false);
        when(encoder.encode("123456")).thenReturn("encoded123456");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("User registered successfully!"))
                .andExpect(jsonPath("$.data").value("newuser"));
    }

    @Test
    void testRegister_UsernameTaken() throws Exception {
        RegisterRequest req = new RegisterRequest("existing", "exist@debtmaster.vn", "123456", Collections.singleton("user"));
        when(userRepository.existsByUsername("existing")).thenReturn(true);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Error: Username is already taken!"));
    }

    @Test
    void testRegister_EmailTaken() throws Exception {
        RegisterRequest req = new RegisterRequest("newuser", "existing@debtmaster.vn", "123456", Collections.singleton("user"));
        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("existing@debtmaster.vn")).thenReturn(true);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Error: Email is already in use!"));
    }

    @Test
    void testRegister_RolesAdminAndStaff() throws Exception {
        RegisterRequest req = new RegisterRequest("special", "special@debtmaster.vn", "123456", java.util.Set.of("admin", "staff", "other"));
        when(userRepository.existsByUsername("special")).thenReturn(false);
        when(userRepository.existsByEmail("special@debtmaster.vn")).thenReturn(false);
        when(encoder.encode("123456")).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testRegister_NullRoles() throws Exception {
        RegisterRequest req = new RegisterRequest("nullroles", "nullroles@debtmaster.vn", "123456", null);
        when(userRepository.existsByUsername("nullroles")).thenReturn(false);
        when(userRepository.existsByEmail("nullroles@debtmaster.vn")).thenReturn(false);
        when(encoder.encode("123456")).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testGetCurrentUser_Authenticated() throws Exception {
        User user = new User("admin", "123456", "admin@debtmaster.vn", Collections.singleton(RoleType.ROLE_ADMIN));
        user.setId(1L);
        UserDetailsImpl principal = UserDetailsImpl.build(user);
        Authentication auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

        mockMvc.perform(get("/api/auth/me").principal(auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Current user profile"));
    }

    @Test
    void testGetCurrentUser_GuestMode() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Guest Mode"));
    }
}
