package com.buildit.store.auth.application;

import com.buildit.store.auth.domain.Role;
import com.buildit.store.auth.domain.User;
import com.buildit.store.auth.infrastructure.UserRepository;
import com.buildit.store.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = normalizeEmail(request.email());
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        User user = new User(normalizedEmail, passwordEncoder.encode(request.password()), Role.ROLE_USER);
        userRepository.save(user);
        return tokenResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = normalizeEmail(request.email());
        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        return tokenResponse(user);
    }

    public UserInfoResponse me(String email) {
        User user = userRepository.findByEmail(normalizeEmail(email))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return new UserInfoResponse(user.getEmail(), user.getRole().name());
    }

    private AuthResponse tokenResponse(User user) {
        String role = user.getRole().name();
        return new AuthResponse(jwtService.createToken(user.getEmail(), role), "Bearer", jwtService.getTokenTtlSeconds(), role);
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }
}
