package com.buildit.store.config;

import com.buildit.store.auth.domain.Role;
import com.buildit.store.auth.domain.User;
import com.buildit.store.auth.infrastructure.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;

@Configuration
public class AuthDataInitializer {

    @Bean
    CommandLineRunner initUsers(UserRepository userRepository,
                                PasswordEncoder passwordEncoder,
                                @Value("${BUILDIT_ADMIN_EMAIL:}") String adminEmail,
                                @Value("${BUILDIT_ADMIN_PASSWORD:}") String adminPassword) {
        return args -> {
            if (!StringUtils.hasText(adminEmail) || !StringUtils.hasText(adminPassword)) {
                return;
            }

            String normalizedEmail = adminEmail.trim().toLowerCase();
            if (!userRepository.existsByEmail(normalizedEmail)) {
                userRepository.save(new User(normalizedEmail, passwordEncoder.encode(adminPassword), Role.ROLE_ADMIN));
            }
        };
    }
}
