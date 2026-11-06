package com.cactus.practice.rest;

import com.cactus.practice.dto.ApiResponse;
import com.cactus.practice.dto.UserDto;
import com.cactus.practice.entity.RoleType;
import com.cactus.practice.entity.User;
import com.cactus.practice.exception.BusinessException;
import com.cactus.practice.exception.ResourceNotFoundException;
import com.cactus.practice.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Admin & Role Management", description = "Endpoints for managing users, accounts, and assigning system roles (ROLE_ADMIN, ROLE_STAFF, ROLE_USER)")
public class AdminController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AdminController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/users")
    @Operation(summary = "List all user accounts and their assigned roles")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        List<UserDto> users = userRepository.findAll().stream()
                .map(u -> new UserDto(
                        u.getId(),
                        u.getUsername(),
                        u.getEmail(),
                        u.isEnabled(),
                        u.getRoles().stream().map(Enum::name).collect(Collectors.toSet())
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok("Users and roles retrieved successfully", users));
    }

    @PostMapping("/users")
    @Operation(summary = "Create a new user account with specified roles")
    public ResponseEntity<ApiResponse<UserDto>> createUser(@RequestBody Map<String, Object> payload) {
        String username = (String) payload.get("username");
        String email = (String) payload.get("email");
        String password = (String) payload.get("password");

        if (username == null || username.trim().isEmpty()) {
            throw new BusinessException("Username cannot be empty");
        }
        if (email == null || email.trim().isEmpty()) {
            throw new BusinessException("Email cannot be empty");
        }
        if (userRepository.existsByUsername(username)) {
            throw new BusinessException("Username already exists");
        }
        if (userRepository.existsByEmail(email)) {
            throw new BusinessException("Email already exists");
        }

        User user = new User(
                username,
                passwordEncoder.encode(password != null && !password.isEmpty() ? password : "password123"),
                email
        );

        Set<RoleType> roles = new HashSet<>();
        Object rolesObj = payload.get("roles");
        if (rolesObj instanceof List<?>) {
            for (Object r : (List<?>) rolesObj) {
                try {
                    String rStr = r.toString().toUpperCase();
                    if (!rStr.startsWith("ROLE_")) rStr = "ROLE_" + rStr;
                    roles.add(RoleType.valueOf(rStr));
                } catch (Exception ignored) {}
            }
        }
        if (roles.isEmpty()) {
            roles.add(RoleType.ROLE_USER);
        }

        user.setRoles(roles);
        User saved = userRepository.save(user);

        UserDto dto = new UserDto(
                saved.getId(),
                saved.getUsername(),
                saved.getEmail(),
                saved.isEnabled(),
                saved.getRoles().stream().map(Enum::name).collect(Collectors.toSet())
        );

        return ResponseEntity.ok(ApiResponse.ok("User created successfully", dto));
    }

    @PutMapping("/users/{id}/roles")
    @Operation(summary = "Assign or update roles for a user")
    public ResponseEntity<ApiResponse<UserDto>> updateUserRoles(
            @PathVariable Long id,
            @RequestBody Set<String> roles) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        Set<RoleType> newRoles = new HashSet<>();
        if (roles != null) {
            for (String r : roles) {
                String normalized = r.trim().toUpperCase();
                if (!normalized.startsWith("ROLE_")) {
                    normalized = "ROLE_" + normalized;
                }
                try {
                    newRoles.add(RoleType.valueOf(normalized));
                } catch (IllegalArgumentException ignored) {}
            }
        }
        if (newRoles.isEmpty()) {
            newRoles.add(RoleType.ROLE_USER);
        }

        user.setRoles(newRoles);
        User updated = userRepository.save(user);

        UserDto dto = new UserDto(
                updated.getId(),
                updated.getUsername(),
                updated.getEmail(),
                updated.isEnabled(),
                updated.getRoles().stream().map(Enum::name).collect(Collectors.toSet())
        );

        return ResponseEntity.ok(ApiResponse.ok("User roles updated successfully", dto));
    }

    @PutMapping("/users/{id}/status")
    @Operation(summary = "Toggle user enabled/disabled status")
    public ResponseEntity<ApiResponse<UserDto>> toggleUserStatus(
            @PathVariable Long id,
            @RequestParam boolean enabled) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        user.setEnabled(enabled);
        User updated = userRepository.save(user);

        UserDto dto = new UserDto(
                updated.getId(),
                updated.getUsername(),
                updated.getEmail(),
                updated.isEnabled(),
                updated.getRoles().stream().map(Enum::name).collect(Collectors.toSet())
        );

        return ResponseEntity.ok(ApiResponse.ok("User status updated successfully", dto));
    }
}
