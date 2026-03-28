package com.buildit.store.config;

import com.buildit.store.auth.domain.Role;
import com.buildit.store.auth.domain.User;
import com.buildit.store.auth.infrastructure.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AuthDataInitializer {

    @Bean
    CommandLineRunner initUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (!userRepository.existsByEmail("admin@buildit.local")) {
                userRepository.save(new User("admin@buildit.local", passwordEncoder.encode("AdminPass123!"), Role.ROLE_ADMIN));
            }
        };
    }
}
